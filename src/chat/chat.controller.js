const { embedSentence } = require("../services/embber"); 
const { getRelevantChunks } = require("../services/qdrant");
const { callGemini } = require("../services/gemini");
const { getMessages, clearSession, saveMessage, getMemory } = require("../services/redis");

// DELETE /chat/history/:sessionId
const deleteChat = async (req, res) => {
  const { sessionId } = req.params;
  try {
    await clearSession(sessionId);
    res.json({ data : {sessionId, cleared: true } , status : true });
  } catch (err) {
    console.error("❌ Delete chat error:", err);
    res.status(500).json({ error: "Failed to clear history" });
  }
};

// GET /chat/history/:sessionId
const getChat = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const history = await getMessages(sessionId);
    res.json({ data : {sessionId, history } , status : true });
  } catch (err) {
    console.error("❌ Get chat history error:", err);
    res.status(500).json({ error: "Failed to load chat history" , status : false });
  }
};

// POST /chat

const createChat = async (req, res) => {
  try {
    const { question, sessionId } = req.body;
    if (!question || question.trim().length === 0)
      return res.status(400).json({ status : false , error: "Missing question" });

    // Step 1: Load session memory
    const memory = getMemory(sessionId);

    // Step 2: Save user input in memory
    await memory.addUserMessage(question);

    // Step 3: Embed the question and get relevant chunks
    const queryEmbedding = await embedSentence(question);
    const retrievedChunks = await getRelevantChunks(queryEmbedding, 5);
console.log("Retrieved chunks:", retrievedChunks);
    const context = retrievedChunks
      .map((chunk, idx) => `(${idx + 1}) ${chunk.payload.title}: ${chunk.payload.text?.slice(0, 400) || ""}`)
      .join("\n\n");

    // Step 4: Include past conversation in prompt
    const chatHistory = await memory.getMessages(); // all past messages
    const historyText = chatHistory
      .map(m => `${m.type === "user" ? "user" : "bot"}: ${m.text}`)
      .join("\n");

    const prompt = `You are a helpful AI assistant specialized in news. 
Use the context below and previous chat history to answer clearly  and answer question related to That and meanings.

Context:
${context}

Chat History:
${historyText}

User Question:
${question}

Answer concisely:`;

    // Step 5: Call Gemini
    const answer = await callGemini(prompt);

    // Step 6: Save bot reply in memory
    await memory.addAIMessage(answer);

    // Step 7: Return response
    res.json({
      status : true ,
      data : {
      sessionId,
      answer,
      sources: retrievedChunks.map(r => r.payload.source_url || null),
      }

    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Server error"  , status : false });
  }
};



module.exports = {
  deleteChat,
  getChat,
  createChat,
};
