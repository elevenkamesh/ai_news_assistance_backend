const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const chatRoutes = require("./chat/chat.router");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/chat", chatRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Voosh Test Chatbot backend is running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
