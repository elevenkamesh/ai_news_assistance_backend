const axios = require('axios');
const { embedSentence } = require('../services/embber');
const { saveDocument, ensureCollection } = require('../services/qdrant');
const { Config } = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
async function fetchNewsAPI(query = 'technology') {
  const res = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
    apiKey: Config.NEWS_API_KEY || "4f352c6a7b2247aaa14f5a95f758d8ea",
    language: 'en',
    country:'us',
    category:'business'
    },
  });

  console.log('NewsAPI response status:', res.status);
  return res.data.articles.map((article, idx) => ({
    id: article.url,
    title: article.title,
    text: article.description || article.content || '',
  }));
}


function makeId(article) {
  // Option 1: Use URL as ID (string-safe)
  if (article.url) return article.url;

  // Option 2: Fallback: hash the title
  return crypto.createHash('sha256').update(article.title).digest('hex');
}



(async () => {
  try {
    const articles = await fetchNewsAPI();

    console.log("Fetched", articles.length, "articles");

    if (!articles.length) return;

    // Embed first article to get dimension
    const sampleVector = await embedSentence(articles[0].text);
    await ensureCollection(sampleVector.length); // ensure collection exists with correct dimension

    for (const article of articles) {
      if (!article.text) continue; // skip empty articles
      const vector = await embedSentence(article.text);
      
      if (!vector || !Array.isArray(vector)) {
          console.warn("Skipping article due to invalid vector:", article.title);
          continue;
        }
        
        const id = uuidv4(); 
    //   const id = makeId(article);
      const metadata = {
        title: article.title || "Untitled",
        text: article.text,
        source_url: article.url || null,
        published_at: article.publishedAt || null,
      };

      await saveDocument(id, vector, metadata);
    }

    console.log("✅ All articles processed");
  } catch (err) {
    console.error("❌ Failed to load articles:", err);
  }
})();
