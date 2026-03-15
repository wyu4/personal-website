const createRepositoriesAPI = (app) => {
    var updatingRepositories = false;
    var repositories = undefined;

    const ApiKey = process.env.GITHUB_API_KEY;

    if (ApiKey) {
        const stringKey = String(ApiKey);
        console.log(
            `🗝️  Using GitHub Personal Access Token: [${stringKey.slice(0, Math.min(20, stringKey.length))}...]`,
        );
    } else {
        console.log(`🗝️  Not using GitHub Personal Access Token...`);
    }

    const updateRepositories = async () => {
        if (updatingRepositories) return;
        updatingRepositories = true;
        console.log("💻 Updating repositories...");
        fetch("https://api.github.com/users/wyu4/repos?type=all&sort=updated", {
            method: "GET",
            headers: ApiKey
                ? {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${ApiKey}`,
                  }
                : {
                      "Content-Type": "application/json",
                  },
        })
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
            });
    };
    updateRepositories();

    app.get("/api/repositories", (req, res) => {
        console.log(`<<< Received repository ping from ${req.ip}.`);
        if (repositories === undefined) {
            return res.sendStatus(404);
        }
        res.send(JSON.stringify(repositories));
    });

    setInterval(updateRepositories, 10 * 60 * 1000);
};

module.exports = createRepositoriesAPI;
