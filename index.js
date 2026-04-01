// index.js
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// Temporary token store (only 1 at a time for simplicity)
let temporaryToken = null;

// Helper to generate random token
function generateToken() {
  return crypto.randomBytes(16).toString("hex"); // 32-char token
}

// Endpoint: /token
app.post("/token", (req, res) => {
  const clientKey = req.body.api_key;

  if (!clientKey || clientKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API_KEY" });
  }

  // Generate temporary token
  temporaryToken = generateToken();

  // Return token to the client
  res.json({ token: temporaryToken });
});

// Endpoint: /text-get
app.get("/text-get", (req, res) => {
  const clientToken = req.headers["x-api-token"];

  if (!clientToken || clientToken !== temporaryToken) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  // Clear the token immediately
  temporaryToken = null;

  // Return the text
  res.send("print[[hi]]");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));