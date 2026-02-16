const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;

    // The JS SDK doesn't have listModels, we use fetch
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log('Available Models:');
            data.models.forEach(m => console.log(`- ${m.name}`));
        } else {
            console.log('No models found or error:', JSON.stringify(data));
        }
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

listModels();
