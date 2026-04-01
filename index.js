const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const app = express();
app.use(express.json());

// In-memory store for temporary tokens
// Map<token, { userId: number, expires: Date }>
const activeTokens = new Map();

// Helper: generate a random token
function generateToken() {
  return crypto.randomBytes(16).toString("hex"); // 32-char token
}

async function verifyRobloxCookie(cookie) {
  try {
    const response = await axios.get("https://users.roblox.com/v1/users/authenticated", {
      headers: {
        Cookie: `.ROBLOSECURITY=${cookie}`
      }
    });
    return response.data.id; // Roblox UserId
  } catch (err) {
    return null; // Invalid cookie
  }
}

app.post("/get-token", async (req, res) => {
  const roblosecurity = req.body.roblosecurity;

  if (!roblosecurity) {
    return res.status(400).json({ error: "Missing roblosecurity token in body" });
  }

  const userId = await verifyRobloxCookie(roblosecurity);

  if (!userId) {
    return res.status(401).json({ error: "Invalid Roblox cookie" });
  }

  // Generate short-lived token
  const token = generateToken();
  const expires = Date.now() + 10000; // expires in 10 seconds
  activeTokens.set(token, { userId, expires });

  res.json({ token, expires });
});

app.get("/protected", (req, res) => {
  const token = req.headers["x-api-token"];

  if (!token || !activeTokens.has(token)) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  const data = activeTokens.get(token);

  // Check if token expired
  if (Date.now() > data.expires) {
    activeTokens.delete(token);
    return res.status(403).json({ error: "Token expired" });
  }

  // Invalidate token immediately
  activeTokens.delete(token);

  res.json({ message: `Hello Roblox user ${data.userId}! Access granted.` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));