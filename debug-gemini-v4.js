const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './apps/api/.env' });

async function testModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;
    const genAI = new GoogleGenerativeAI(apiKey);

    // Explicitly testing models from the list with and without 'models/' prefix
    const testCases = [
        'gemini-2.0-flash-lite',
        'models/gemini-2.0-flash-lite',
        'gemini-2.0-flash',
        'models/gemini-2.0-flash',
        'gemini-2.5-flash',
        'models/gemini-2.5-flash'
    ];

    for (const m of testCases) {
        try {
            console.log(`\nTesting: ${m}`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('hi');
            console.log(`✅ Success for ${m}: ${result.response.text().trim().substring(0, 30)}`);
        } catch (e) {
            console.log(`❌ Failed for ${m}: ${e.message}`);
        }
    }
}

testModel();
