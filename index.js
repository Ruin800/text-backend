const express = require("express");
const crypto = require("crypto");
const compression = require("compression");
const { resource1, veryCoolScript } = require("./resources");

const app = express();
app.use(compression());
app.use(express.json());

const resources = {
  resource1,
  veryCoolScript,
};

const tokenStore = {};

function generateToken() {
  return crypto.randomBytes(16).toString("hex");
}

app.post("/token/:resourceName", (req, res) => {
  const clientKey = req.body.api_key;
  const resourceName = req.params.resourceName;

  if (!clientKey || clientKey !== process.env.api_key) {
    return res.status(403).json({ error: "invalid api key" });
  }

  if (!resources[resourceName]) {
    return res.status(404).json({ error: "resource not found" });
  }

  const token = generateToken();
  const expireTime = Date.now() + 60 * 1000; // 1 minute

  tokenStore[token] = {
    resourceName,
    expires: expireTime,
  };

  res.json({ token });
});

app.get("/text-get/:token", (req, res) => {
  const { token } = req.params;
  const entry = tokenStore[token];

  if (!entry || entry.expires < Date.now()) {
    return res.status(403).json({ error: "invalid or expired token" });
  }

  const resourceData = resources[entry.resourceName];

  delete tokenStore[token];

  res.json({ resource: resourceData });
});

setInterval(() => {
  const now = Date.now();
  for (const token in tokenStore) {
    if (tokenStore[token].expires < now) {
      delete tokenStore[token];
    }
  }
}, 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));