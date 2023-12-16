import bodyParser from "body-parser";
import express from "express";
import path from "path"
import fs from "fs";

const app = express();

app.use(express.static(path.join(__dirname, './public')))
app.use(bodyParser.json());

app.get("/", async (req, res) => {
    const index = Bun.file("./public/index.html");
    res.send(await index.text());
});

app.post("/lastfile", async (req, res) => {
    const body = req.body;
    console.log("lastFile", body);
    Bun.write("./lastFile", JSON.stringify(body))
    sendPushNotifications(body.file);
    res.json({});
});

app.get("/lastfile", async (req, res) => {
    const lastFile = Bun.file("./lastFile")
    res.send(await lastFile.text());
});


// potrebno na VER06
const webpush = require('web-push');

// Umjesto baze podataka, čuvam pretplate u datoteci:
let subscriptions: any[] = [];
const SUBS_FILENAME = 'subscriptions.json';
try {
    subscriptions = JSON.parse(await Bun.file(SUBS_FILENAME).text());
} catch (error) {
    console.error(error);
}

app.post("/saveSubscription", function(req, res) {
    console.log(req.body);
    let sub = req.body.sub;
    subscriptions.push(sub);
    fs.writeFileSync(SUBS_FILENAME, JSON.stringify(subscriptions));
    res.json({
        success: true
    });
});

async function sendPushNotifications(snapTitle: any) {
    webpush.setVapidDetails('mailto:marko.jerkic@fer.hr',
        'BNw2aqnBg_WYL847mONxzeVRDumAVnrzAsdaWrlc-ahGDae_H4cLYtNTkRtcR-2-NAllm0-k_3bQ-fd2i8Qr8FA',
        'VP6P-ZZUSNrQeOOVdq1asNdOm9lDUX2YCq8xwL_e5DA'
    );
    subscriptions.forEach(async sub => {
        try {
            console.log("Sending notif to", sub);
            await webpush.sendNotification(sub, JSON.stringify({
                title: 'New snap!',
                body: 'Somebody just read a new file: ' + snapTitle,
                redirectUrl: '/index.html'
            }));
        } catch (error) {
            console.error(error);
        }
    });
}


app.listen(3000, () => {
    console.log("Running");
});
