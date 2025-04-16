const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/ticket", (req, res) => {
    try {
        const { body } = req;

        const email = String(body.email);
        const firstName = String(body.first);
        const lastName = String(body.last);
        const message = String(body.message);

        if (!email.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) {
            res.send({
                message: 'Please enter a valid email.',
                status: false
            });
            return;
        }

        const webhookURL = process.env.TICKET_WEBHOOK_URL;
        const webhookBody = JSON.stringify({
            embeds: [{
                title: `Email: \`${email}\``,
                description: message,
                author: {
                    name: `${firstName} ${lastName}`
                }
            }]
        });

        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: webhookBody
        }).then(_ => {
            res.send({
                message: 'Ticket submitted!',
                status: true
            });
        }).catch(err => {
            throw err;
        });
    } catch (err) {
        console.error(err);

        res.send({
            message: 'An internal error has occurred.',
            status: false
        });
    }
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

module.exports = app;