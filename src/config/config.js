require('dotenv').config({ path: "/home/lakshmi-priya/Documents/kamesh/prototype/voosh/backend/.env" });

const Config = {
QDRANT_URL : process.env.QDRANT_URL,
COLLECTION : "voosh_t1",
NEWS_API_KEY : process.env.NEWS_API_KEY,
GEMINI_API_KEY : process.env.GEMINI_API_KEY
}

module.exports = { Config };