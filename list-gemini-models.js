const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;
    const genAI = new GoogleGenerativeAI(apiKey);

    // The SDK doesn't have a direct listModels, but we can try to find out 
    // by calling a common one and looking at the response or trying to infer.
    // Actually, there is no direct way in the JS SDK to list models.

    console.log('Testing specific common models:');
    const common = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-1.5-pro',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite-preview-02-05',
        'gemini-exp-1206',
        'gemini-2.0-flash-exp'
    ];

    for (const m of common) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent('hi');
            console.log(`✅ ${m} is available`);
        } catch (e) {
            console.log(`❌ ${m} is NOT available or rate limited: ${e.message}`);
        }
    }
}

listModels();
