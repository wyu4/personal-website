const createRepositoriesAPI = (app) => {
    var updatingRepositories = false;
    var updatingLanguages = false;
    var repositories = undefined;
    var allLanguagesIndexed = true;
    var languageIndex = {};

    const ApiKey = process.env.GITHUB_API_KEY;

    if (ApiKey) {
        const stringKey = String(ApiKey);
        console.log(
            `🗝️  Using GitHub Personal Access Token: [${stringKey.slice(0, Math.min(20, stringKey.length))}].`,
        );
    } else {
        console.log(`🗝️ Not using GitHub Personal Access Token.`);
    }

    const githubHeader = {
        method: "GET",
        headers: ApiKey
            ? {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${ApiKey}`,
              }
            : {
                  "Content-Type": "application/json",
              },
    };

    const updateLanguages = () => {
        if (
            updatingRepositories ||
            updatingLanguages ||
            repositories === undefined
        ) {
            return;
        }
        allLanguagesIndexed = true;
        console.log(`💻 Updating languages...`);
        for (const repo of repositories) {
            const name = repo.name;
            const languageUrl = repo.languages_url;
            if (languageUrl === undefined || name === undefined) continue;

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
                    languageIndex[name] = parsed;
                    console.log(`💻 Updated language index for [${name}]!`);
                })
                .catch((err) => {
                    console.error(
                        `💻 Could not fetch languages for [${name}]: ${err}`,
                    );
                    allLanguagesIndexed = false;
                });
        }
    };

    const updateRepositories = () => {
        if (updatingRepositories) return;
        updatingRepositories = true;
        console.log("💻 Updating repositories...");
        const prevRepositories = repositories;
        fetch(
            "https://api.github.com/users/wyu4/repos?type=all&sort=updated",
            githubHeader,
        )
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
                throw new Error(
                    `Status ${res.status} with text "${res.statusText}"`,
                );
            })
            .then((parsed) => {
                repositories = parsed.map((repo) => ({
                    name: repo.name,
                    html_url: repo.html_url,
                    owner: {
                        login: repo.owner.login,
                        avatar_url: repo.owner.avatar_url,
                        html_url: repo.owner.html_url,
                        type: repo.owner.type,
                    },
                    description: repo.description,
                    fork: repo.fork,
                    archived: repo.archived,
                    languages_url: repo.languages_url,
                }));
                console.log(`💻 Repositories updated!`);
            })
            .catch((err) => {
                console.error(`💻 Could not fetch GitHub repositories: ${err}`);
            })
            .finally(() => {
                updatingRepositories = false;
                if (repositories !== prevRepositories || !allLanguagesIndexed) {
                    updateLanguages();
                }
            });
    };

    updateRepositories();

    app.get("/api/repositories", (req, res) => {
        console.log(`<<< Received repository ping from ${req.ip}.`);
        if (repositories === undefined) {
            return res.sendStatus(404);
        }
        res.json(repositories);
    });

    app.get("/api/repositories/languages", (req, res) => {
        console.log(`<<< Received languages ping from ${req.ip}.`);

        const count = {};
        for (const langs of Object.values(languageIndex)) {
            for (const [lang, langCount] of Object.entries(langs)) {
                if (count[lang]) {
                    count[lang] += langCount;
                } else {
                    count[lang] = langCount;
                }
            }
        }

        res.json(count);
    });

    setInterval(updateRepositories, 30 * 60 * 1000);
};

module.exports = createRepositoriesAPI;
