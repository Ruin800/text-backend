require("dotenv").config(); // Load .env variables
const express = require("express");
const app = express();

// GET endpoint returning text
app.get("/", (req, res) => {
  const message = process.env.TEXT_MESSAGE || "Hello from Render!";

  // Log details about the request
  console.log("Request received:");
  console.log("IP:", req.ip);               // Client IP (may be proxied)
  console.log("Headers:", req.headers);     // All headers
  console.log("User-Agent:", req.headers["user-agent"]);

  res.json({ message });
});

// Another GET endpoint example
app.get("/info", (req, res) => {
  res.send("This is a secondary endpoint.");
});

app.get("/say", (req, res) => {
  const name = req.query.name || "Guest";
  res.send(`Hello, ${name}!`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));