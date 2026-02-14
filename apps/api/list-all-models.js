const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log('--- ALL AVAILABLE MODELS ---');
        response.data.models.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
