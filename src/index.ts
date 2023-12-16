import express from "express";
import path from "path"

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.get("/sw.js", async (req, res) => {
    const index = Bun.file("./sw.js");
    res.set("content-type", "text/js");

    res.type("js");
    res.send(await index.text());
});

app.get("/", async (req, res) => {
    const index = Bun.file("./public/index.html");
    res.send(await index.text());
});

app.listen(3000, () => {
    console.log("Running");
});
