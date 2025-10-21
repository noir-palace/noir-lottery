// proxy.js — γράφει στο lottery.json χωρίς CORS πρόβλημα
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/update", async (req, res) => {
  try {
    const { token, content, sha } = req.body;
    const r = await fetch("https://api.github.com/repos/vmavro29-rlc/noir-lottery/contents/lottery.json", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update from Noir Lottery Board (Proxy)",
        content: Buffer.from(JSON.stringify(content, null, 2)).toString("base64"),
        branch: "main",
        sha
      })
    });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Proxy running on port " + port));