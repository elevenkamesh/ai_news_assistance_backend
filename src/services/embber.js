// src/services/embedder.js
let model = null;

// Load once
async function loadModel() {
  if (!model) {
    const { pipeline } = await import('@xenova/transformers');
    model = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return model;
}

// Generate sentence embedding
async function embedSentence(text) {
  const embedder = await loadModel();
  const output = await embedder(text, {
    pooling: 'mean',
    normalize: true,
  });
  console.log('Raw embedding output:', output);
  return Array.from(output.data); // Float32Array → regular array
}

module.exports = { embedSentence };
