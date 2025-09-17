// src/services/memory.js
const redis = require('redis');

const client = redis.createClient();
client.connect();

/**
 * Save a message (user or bot) in Redis
 * @param {string} sessionId 
 * @param {object} message - { sender: "user" | "bot", text: string }
 */
async function saveMessage(sessionId, message) {
  await client.rPush(sessionId, JSON.stringify(message));
  await client.expire(sessionId, 3600); // TTL: 1 hour
}

/**
 * Get all messages for a session
 * @param {string} sessionId 
 * @returns {Array<{sender:string, text:string}>}
 */
async function getMessages(sessionId) {
  const messages = await client.lRange(sessionId, 0, -1);
  return messages.map(m => JSON.parse(m));
}

/**
 * Clear session history
 * @param {string} sessionId 
 */
async function clearSession(sessionId) {
  await client.del(sessionId);
}

/**
 * Returns a memory-like interface compatible with LangChain
 */
function getMemory(sessionId) {
  return {
    addUserMessage: async (text) => saveMessage(sessionId, { sender: "user", text }),
    addAIMessage: async (text) => saveMessage(sessionId, { sender: "bot", text }),
    getMessages: async () => getMessages(sessionId),
    clear: async () => clearSession(sessionId),
  };
}

module.exports = { saveMessage, getMessages, clearSession, getMemory };
