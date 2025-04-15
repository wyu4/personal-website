const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); 

app.post("/api/ticket", (req, res) => {
    var returnMessage = '';
    var returnStatus = true;
    try {
        const { body } = req;
        console.log(body);

        returnMessage = 'Ticket submitted!';
        returnStatus = true;
    } catch (err) {
        console.error(err);
        returnMessage = 'An internal error has occurred.';
        returnStatus = false;
    }
    res.send(JSON.stringify({
        message: returnMessage,
        status: returnStatus
    }));
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

module.exports = app;