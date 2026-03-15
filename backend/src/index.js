const express = require("express");
const path = require("path");
const createRootAPI = require("./api/root");
const createRepositoriesAPI = require("./api/repository");

const app = express();

app.use(express.static(path.join(__dirname, "src")));
app.use(express.json());

createRootAPI(app, path);
createRepositoriesAPI(app);

app.listen(3000, () => {
    console.log("✅ Express running on http://localhost:3000");
});
