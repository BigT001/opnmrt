const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        console.log('Fetching models from:', url.split('key=')[0] + 'key=***');
        const response = await axios.get(url);
        console.log('Models found:', response.data.models.map(m => m.name));
    } catch (error) {
        console.error('Error listing models:', error.response ? error.response.data : error.message);
    }
}

listModels();
