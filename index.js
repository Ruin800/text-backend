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

function logRequest(req, extra = {}) {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    ...extra,
  };

  console.log(JSON.stringify(logData, null, 2));
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

app.get("/text-get/:token", (req, res) => {
  const startTime = Date.now();
  const { token } = req.params;

  const entry = tokenStore[token];

  if (!entry) {
    logRequest(req, {
      event: "INVALID_TOKEN",
      token,
      reason: "Token not found",
      status: 403,
    });

    return res.status(403).json({ error: "invalid or expired token" });
  }

  if (entry.expires < Date.now()) {
    logRequest(req, {
      event: "EXPIRED_TOKEN",
      token,
      resourceName: entry.resourceName,
      expiredAt: entry.expires,
      status: 403,
    });

    delete tokenStore[token];

    return res.status(403).json({ error: "invalid or expired token" });
  }

  const resourceData = resources[entry.resourceName];

  delete tokenStore[token];

  const duration = Date.now() - startTime;

  logRequest(req, {
    event: "RESOURCE_DELIVERED",
    token,
    resourceName: entry.resourceName,
    expiresAt: entry.expires,
    responseTimeMs: duration,
    status: 200,
  });

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