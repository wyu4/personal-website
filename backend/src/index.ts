import express from "express";
import cors from "cors";
import { createRootAPI } from "./api/root";
import { createRepositoriesAPI } from "./api/repository";
import { ALLOWED_ORIGINS } from "./helpers/external";

const app = express();

app.use(
    cors({
        origin: ALLOWED_ORIGINS,
    }),
);

app.use(express.static(__dirname));
app.use(express.json());

console.log("☁️ Creating endpoints...");
createRootAPI(app);
createRepositoriesAPI(app);
console.log("☁️✅ Endpoints created!");

app.listen(3000, () => {
    console.log("✅ Express running on http://localhost:3000");
});
