const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function testModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Testing models from the provided list...');

    // Models found in list-models-v2.js
    const models = [
        'gemini-2.0-flash',
        'gemini-2.0-flash-lite',
        'gemini-2.5-flash',
        'gemini-1.5-flash' // Let's check this again with the full name
    ];

    for (const modelName of models) {
        try {
            console.log(`\nTrying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            console.log(`✅ ${modelName}: ${result.response.text().trim()}`);
            console.log(`   Finish Reason: ${result.response.candidates[0].finishReason}`);
        } catch (error) {
            console.error(`❌ ${modelName} FAILED:`);
            console.error('  Message:', error.message);
            if (error.status) console.error('  Status:', error.status);
            if (error.response?.data) {
                console.error('  Details:', JSON.stringify(error.response.data));
            }
        }
    }
}

testModel();
