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

    if (IsTestRepositories) {
        console.log(
            `>>>>>>>>>>>>>>>>>> 🔧 Creating repository API under testing context. <<<<<<<<<<<<<<<<<<<`,
        );
    }

    if (ApiKey) {
        const stringKey = String(ApiKey);
        console.log(
            `🗝️ Using GitHub Personal Access Token: [${stringKey.slice(0, Math.min(20, stringKey.length))}].`,
        );
    } else {
        console.log(
            `🗝️ Not using GitHub Personal Access Token. Subject to rate limits.`,
        );
    }

    const githubHeader = {
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

            fetch(languageUrl, githubHeader)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json();
                    }
                    throw new Error(
                        `Status ${res.status} with text "${res.statusText}"`,
                    );
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
                    console.error(
                        `💻❌ Could not fetch languages for [${name}]: ${err}`,
                    );
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
        fetch(repositoryLink, githubHeader)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
                throw new Error(
                    `Status ${res.status} with text "${res.statusText}"`,
                );
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
                console.error(
                    `💻❌ Could not fetch GitHub repositories: ${err}`,
                );
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
    setInterval(
        () => {
            const now = Date.now();
            if (now - timeSinceLastHardUpdate >= 30 * 60 * 1000) {
                updateRepositories(true);
                timeSinceLastHardUpdate = now;
            } else {
                updateRepositories(false);
            }
        },
        10 * 60 * 1000,
    );
};

module.exports = createRepositoriesAPI;
