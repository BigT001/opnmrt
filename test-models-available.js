const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function testModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Testing models...');

    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-2.0-flash-exp',
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite-preview-02-05',
        'gemini-2.5-flash-lite' // The one I currently have
    ];

    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            console.log(`✅ Model ${modelName} is WORKING:`, result.response.text());
        } catch (error) {
            console.error(`❌ Model ${modelName} FAILED:`, error.message);
        }
    }
}

testModel();
