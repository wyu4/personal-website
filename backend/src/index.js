const express = require("express");
const path = require("path");
const cors = require("cors");
const createRootAPI = require("./api/root");
const createRepositoriesAPI = require("./api/repository");

const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Localhost
            "https://wyu.app", // Production domain
            "https://personal-website-zeta-lilac-47.vercel.app", // Vercel production domain
            "https://personal-website-git-changes-wyu4-team.vercel.app", // Vercel changes domain
        ],
    }),
);

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

app.listen(3000, () => {
    console.log("✅ Express running on http://localhost:3000");
});

setTimeout(() => {
    console.log("☁️ Creating endpoints...");
    createRootAPI(app, path);
    createRepositoriesAPI(app);
    console.log("☁️✅ Endpoints created!");
}, 5000);
