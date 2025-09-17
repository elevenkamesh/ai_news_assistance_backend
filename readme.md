
# News Ai Assistance Backend

This project fetches real-time news, generates embeddings, stores them in Qdrant for vector search, and integrates Gemini LLM (gemini-2.0-flash) for chat-based responses.
It also uses Redis to cache session messages (chat memory).

# Features

Fetch real-time news data

Generate embeddings using Xenova Transformers
 (all-MiniLM-L6-v2)

Store and search news vectors in Qdrant

Use Redis for caching session chat memory

Query data with Gemini LLM (gemini-2.0-flash)

#  Tech Stack

Node.js 20 (Backend)

Qdrant (Vector DB)

Redis (Session Cache)

Xenova Transformers.js (Embeddings)

Gemini LLM (gemini-2.0-flash)

# Example Flow

Fetch news data (via API/script).

Generate embeddings using Xenova Transformers.

Store embeddings in Qdrant for vector search.

Cache session messages in Redis.

Query with Gemini (gemini-2.0-flash) for intelligent responses.

# Start Qdrant (Vector Database)
Pull and run Qdrant with Docker:

```
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant
```

# Start Redis (Session Cache) 
```
docker run --name redis -p 6379:6379 -d redis
```

# how to start 

```
npm run start
```
