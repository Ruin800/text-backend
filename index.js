const express = require("express");
const crypto = require("crypto");
const { resource1, veryCoolScript } = require("./resources");

const app = express();
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

  if (!clientKey || clientKey !== process.env.API_KEY) {
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

const crypto = require("crypto");

app.get("/text-get/:token", (req, res) => {
  const { token } = req.params;
  const entry = tokenStore[token];

  if (!entry || entry.expires < Date.now()) {
    return res.status(403).json({ error: "invalid or expired token" });
  }

  const resourceData = resources[entry.resourceName];

  // 32-byte key from environment
  const key = Buffer.from(process.env.AES_KEY, "hex");

  // 16-byte IV for CBC
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(resourceData, "utf8", "base64");
  encrypted += cipher.final("base64");

  delete tokenStore[token];

  res.json({
    encrypted: encrypted,
    iv: iv.toString("base64"),
  });
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