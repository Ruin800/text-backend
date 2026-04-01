require("dotenv").config(); // Load .env variables
const express = require("express");
const app = express();

// GET endpoint returning text
app.get("/", (req, res) => {
  const message = process.env.TEXT_MESSAGE || "Default text response!";
  res.send(message);
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