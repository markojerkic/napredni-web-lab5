import bodyParser from "body-parser";
import express from "express";
import path from "path"

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
    res.json({});
});

app.get("/lastfile", async (req, res) => {
    const lastFile = Bun.file("./lastFile")
    res.send(await lastFile.text());
});

app.listen(3000, () => {
    console.log("Running");
});
