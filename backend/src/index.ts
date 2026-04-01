import express from "express";
import cors from "cors";
import { createRootAPI } from "./api/root";
import { createRepositoriesAPI } from "./api/repository";

const app = express();

app.use(
    cors({
        origin: "*",
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
