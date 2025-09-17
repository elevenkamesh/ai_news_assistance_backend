import {QdrantClient} from '@qdrant/js-client-rest';

const client = new QdrantClient({
    url: 'https://d07ab16c-1a37-442f-b469-8d2353aec1f3.us-west-1-0.aws.cloud.qdrant.io:6333',
    apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.gi2KjC2muDXUBGo-rqhfTjXeJaFXBHkQWvRKiQyTnJs',
});

try {
    const result = await client.getCollections();
    console.log('List of collections:', result.collections);
} catch (err) {
    console.error('Could not get collections:', err);
}