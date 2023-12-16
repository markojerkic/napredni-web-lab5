import express from "express";
import path from "path"

const app = express();

app.use(express.static(path.join(__dirname, './public')))

app.get("/", async (req, res) => {
    const index = Bun.file("./public/index.html");
    res.send(await index.text());
});

app.listen(3000, () => {
    console.log("Running");
});
