const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/test", (req, res) => {
    console.log("GET request to /test received");
    res.send({ message: "The GET request to /test worked!" });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

module.exports = app;