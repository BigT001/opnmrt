const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function testModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API key found');
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('Testing models with full error reporting...');

    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-8b',
        'gemini-2.0-flash'
    ];

    for (const modelName of models) {
        try {
            console.log(`Trying ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Hi');
            console.log(`✅ ${modelName}: ${result.response.text().substring(0, 20)}...`);
        } catch (error) {
            console.error(`❌ ${modelName} FAILED:`);
            console.error('  Status:', error.status);
            console.error('  Message:', error.message);
            if (error.response) {
                console.error('  Response Data:', JSON.stringify(error.response.data));
            }
        }
    }
}

testModel();
