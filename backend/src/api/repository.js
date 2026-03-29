const supabase = require("@supabase/supabase-js");

const createRepositoriesAPI = (app) => {
  let updatingRepositories = false;
  let updatingLanguages = false;
  let publicRepositories = undefined;
  let allRepositories = undefined;
  let allLanguagesIndexed = true;
  let languageIndex = {};

  const ApiKey = process.env.GITHUB_API_KEY;
  const IsTestRepositories = process.env.TEST_REPOS === "1";
  const ApiVersion = "2026-03-10";
  const RepositoryUpdateInterval = 10 * 60 * 1000;
  const LanguageIndexInterval = 30 * 60 * 1000;

  const slicePreviewKey = (key, chars = 20) => {
    const stringKey = String(key);
    return `${stringKey.slice(0, Math.min(chars, stringKey.length))}...`;
  };

  if (IsTestRepositories) {
    console.log(
      `>>>>>>>>>>>>>>>>>> 🔧 Creating repository API under testing context. <<<<<<<<<<<<<<<<<<<`,
    );
  }

  if (ApiKey) {
    console.log(
      `🗝️ Using GitHub Personal Access Token[${slicePreviewKey(ApiKey)}].`,
    );
  } else {
    console.log(
      `🗝️ Not using GitHub Personal Access Token. Subject to rate limits.`,
    );
  }

  const RepositoryDatabaseCredentials = {
    url: process.env.DATABASE_URL,
    key: process.env.DATABASE_KEY,
  };

  let supabaseClient = undefined;

  if (
    !RepositoryDatabaseCredentials.url ||
    !RepositoryDatabaseCredentials.key
  ) {
    console.log(
      `🗝️ Not storing repository data in repository database. Subject to rate limits.`,
    );
  } else {
    supabaseClient = supabase.createClient(
      RepositoryDatabaseCredentials.url,
      RepositoryDatabaseCredentials.key,
    );
    console.log(
      `🗝️ Storing repository data in repository database '${RepositoryDatabaseCredentials.url}' using credentials: token[${slicePreviewKey(RepositoryDatabaseCredentials.key, 10)}]`,
    );
  }

  const GithubHeader = {
    method: "GET",
    headers: ApiKey
      ? {
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": ApiVersion,
          Authorization: `Bearer ${ApiKey}`,
        }
      : {
          "Content-Type": "application/json",
          "X-GitHub-Api-Version": ApiVersion,
        },
  };

  const repositoryLink = ApiKey
    ? "https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator"
    : "https://api.github.com/users/wyu4/repos?type=all&sort=updated&per_page=100";

  const deduplicate = (rows) => {
    return Array.from(new Map(rows.map((row) => [row.html_url, row])).values());
  };

  const pushToDatabase = () => {
    if (!supabaseClient) {
      return;
    }
    console.log(`🫸 Pushing repository data...`);
    try {
      const ownerRows = deduplicate(allRepositories.map((repo) => repo.owner));
      const repoRows = allRepositories.map((repo, i) => ({
        order: i,
        name: repo.name,
        html_url: repo.html_url,
        owner: repo.owner.login,
        visibility: repo.visibility,
        description: repo.description,
        fork: repo.fork,
        archived: repo.archived,
        languages_url: repo.languages_url,
      }));

      supabaseClient
        .from("github_repository_owners")
        .upsert(ownerRows, { onConflict: "login" })
        .then(({ error }) => {
          if (error) {
            throw new Error(`Owner Rows[${error.message}]`);
          }
          return supabaseClient
            .from("github_repository")
            .upsert(repoRows, { onConflict: "order" });
        })
        .then(({ error }) => {
          if (error) {
            throw new Error(`Repository Rows[${error.message}]`);
          }
          console.log(`🫸✅ Pushed data!`);
        })
        .catch((e) => {
          console.error(`🫸❌ Could not push data: ${e.message}`);
        });
    } catch (e) {
      console.error(`🫸❌ Could not setup data for pushing: ${e.message}`);
    }
  };

  const updateLanguages = () => {
    if (
      updatingRepositories ||
      updatingLanguages ||
      allRepositories === undefined
    ) {
      return;
    }
    let tempLanguageIndex = {};
    let reposChecked = 0;
    allLanguagesIndexed = true;
    console.log(`💻 Updating languages...`);
    for (const repo of allRepositories) {
      const name = repo.name;
      const languageUrl = repo.languages_url;
      const owner = repo.owner;
      if (
        languageUrl === undefined ||
        name === undefined ||
        name.endsWith("-excluded") ||
        owner === undefined
      ) {
        reposChecked++;
        continue;
      }

      const userLogin = owner.login;
      if (userLogin === undefined || userLogin !== "wyu4") {
        reposChecked++;
        continue;
      }

      fetch(languageUrl, GithubHeader)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw new Error(`Status ${res.status} with text "${res.statusText}"`);
        })
        .then((parsed) => {
          for (const [lang, langCount] of Object.entries(parsed)) {
            if (tempLanguageIndex[lang]) {
              tempLanguageIndex[lang] += langCount;
            } else {
              tempLanguageIndex[lang] = langCount;
            }
          }
          reposChecked += 1;
        })
        .catch((err) => {
          console.error(`💻❌ Could not fetch languages for [${name}]: ${err}`);
          allLanguagesIndexed = false;
        })
        .finally(() => {
          if (reposChecked >= allRepositories.length) {
            languageIndex = tempLanguageIndex;
            console.log(`💻✅ All repository languages indexed!`);
          }
        });
    }
  };

  const updateRepositories = (hardUpdateLanguages = false) => {
    if (updatingRepositories) return;
    updatingRepositories = true;
    console.log(
      `💻 Updating repositories [HARD UPDATE = ${hardUpdateLanguages}]...`,
    );
    const prevRepositories = allRepositories;
    fetch(repositoryLink, GithubHeader)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error(`Status ${res.status} with text "${res.statusText}"`);
      })
      .then((parsed) => {
        allRepositories = parsed.map((repo) => ({
          name: repo.name,
          html_url: repo.html_url,
          owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
            html_url: repo.owner.html_url,
            type: repo.owner.type,
          },
          visibility: repo.visibility,
          description: repo.description,
          fork: repo.fork,
          archived: repo.archived,
          languages_url: repo.languages_url,
        }));
        if (IsTestRepositories) {
          console.log(allRepositories);
        }
        if (ApiKey === undefined) {
          publicRepositories = allRepositories;
        } else {
          let tempPublicRepositories = [];
          allRepositories.forEach((item) => {
            if (item.visibility !== "public") return;
            tempPublicRepositories.push(item);
          });
          publicRepositories = tempPublicRepositories;
        }
        console.log(
          `💻✅ Repositories (of ${allRepositories.length}, ${publicRepositories.length} were public) updated!`,
        );
      })
      .catch((err) => {
        console.error(`💻❌ Could not fetch GitHub repositories: ${err}`);
      })
      .finally(() => {
        updatingRepositories = false;
        if (
          !IsTestRepositories &&
          (hardUpdateLanguages ||
            JSON.stringify(allRepositories) !==
              JSON.stringify(prevRepositories) ||
            !allLanguagesIndexed)
        ) {
          updateLanguages();
        }
        pushToDatabase();
      });
  };

  app.get("/api/repositories", (req, res) => {
    console.log(`<<< Received repository ping from ${req.ip}.`);
    if (publicRepositories === undefined) {
      return res.sendStatus(404);
    }
    res.json(publicRepositories);
  });

  // app.get("/api/private_repositories", (req, res) => {
  //     console.log(`<<< Received repository ping from ${req.ip}.`);
  //     if (allRepositories === undefined) {
  //         return res.sendStatus(404);
  //     }
  //     res.json(allRepositories);
  // });

  app.get("/api/repositories/languages", (req, res) => {
    console.log(`<<< Received languages ping from ${req.ip}.`);

    res.json(languageIndex);
  });

  let timeSinceLastHardUpdate = Date.now();
  updateRepositories(true);
  setInterval(() => {
    const now = Date.now();
    if (now - timeSinceLastHardUpdate >= LanguageIndexInterval) {
      updateRepositories(true);
      timeSinceLastHardUpdate = now;
    } else {
      updateRepositories(false);
    }
  }, RepositoryUpdateInterval);
};

module.exports = createRepositoriesAPI;
