import express from "express";
import path from "path";
import cors from "cors";
import { createRootAPI } from "./api/root";
import { createRepositoriesAPI } from "./api/repository";

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

console.log("☁️ Creating endpoints...");
createRootAPI(app);
createRepositoriesAPI(app);
console.log("☁️✅ Endpoints created!");
