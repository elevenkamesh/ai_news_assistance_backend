const express = require("express");
const { createChat, getChat, deleteChat } = require("./chat.controller");
const router = express.Router();


// POST /chat
router.post("/",createChat);


// GET /chat/history/:sessionId
router.get("/history/:sessionId", getChat);


// DELETE /chat/history/:sessionId
router.delete("/history/:sessionId", deleteChat);



module.exports = router;
