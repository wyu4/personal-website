const createRepositoriesAPI = (app) => {
    let updatingRepositories = false;
    let updatingLanguages = false;
    let repositories = undefined;
    let allLanguagesIndexed = true;
    let languageIndex = {};

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
        let tempLanguageIndex = {};
        let reposChecked = 0;
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
                        `💻 Could not fetch languages for [${name}]: ${err}`,
                    );
                    allLanguagesIndexed = false;
                })
                .finally(() => {
                    if (reposChecked >= repositories.length) {
                        languageIndex = tempLanguageIndex;
                        console.log(`💻 All repository languages indexed!`);
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
                if (
                    hardUpdateLanguages ||
                    JSON.stringify(repositories) !==
                        JSON.stringify(prevRepositories) ||
                    !allLanguagesIndexed
                ) {
                    updateLanguages();
                }
            });
    };

    app.get("/api/repositories", (req, res) => {
        console.log(`<<< Received repository ping from ${req.ip}.`);
        if (repositories === undefined) {
            return res.sendStatus(404);
        }
        res.json(repositories);
    });

    app.get("/api/repositories/languages", (req, res) => {
        console.log(`<<< Received languages ping from ${req.ip}.`);

        res.json(languageIndex);
    });

    let timeSinceLastHardUpdate = Date.now();
    updateRepositories(true);
    setInterval(() => {
        const now = Date.now();
        if (now - timeSinceLastHardUpdate >= 30 * 60 * 1000) {
            updateRepositories(true);
            timeSinceLastHardUpdate = now;
        } else {
            updateRepositories(false);
        }
    }, 10 * 60 * 1000);
};

module.exports = createRepositoriesAPI;
