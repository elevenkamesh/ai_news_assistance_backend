const { QdrantClient } = require('@qdrant/js-client-rest');
const { Config } = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const COLLECTION = Config.COLLECTION;

console.log('QDRANT_URL:', Config.QDRANT_URL);

const client = new QdrantClient({
  url: Config.QDRANT_URL, // local or cloud
  timeout: 60000,
  checkCompatibility: false,
});

// Ensure collection exists 
async function ensureCollection(dimension) {
  try {
    await client.getCollection(COLLECTION);
    console.log(`✅ Qdrant collection "${COLLECTION}" already exists`);
  } catch (e) {
    await client.createCollection(COLLECTION, {
      vectors: { size: dimension, distance: 'Cosine' },
    });
    console.log(`✅ Created Qdrant collection: ${COLLECTION}`);
  }
}

// Insert a single document
async function saveDocument(id, vector, metadata) {
  try {
    await client.upsert(COLLECTION, { points: [{ id : id, vector : vector, payload: metadata }] });
console.log(`✅ Saved document ${id} to Qdrant`); 
  } catch (err) {
    console.error(`Failed to save document ${id}:`, err);
  }
}

// Retrieve top K relevant chunks
async function getRelevantChunks(queryVector, topK = 5) {
  try {
    const response = await client.search(COLLECTION, {
      vector: queryVector,
      limit: topK,
    });

    return response.map(item => ({
      id: item.id,
      score: item.score,
      payload: item.payload,
    }));
  } catch (err) {
    console.error('Failed to get relevant chunks:', err.message);
    return [];
  }
}




module.exports = {
  client,
  saveDocument,
  ensureCollection,
  getRelevantChunks,
};
