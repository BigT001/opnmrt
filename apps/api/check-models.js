const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // The SDK doesn't have a direct 'listModels' in the top-level GenAI class usually
        // but we can try to use a model we know exists or try a different approach.
        // Actually, let's try gemini-pro which is the most basic name.

        const models = ["gemini-pro", "gemini-1.5-flash-latest", "gemini-1.5-pro-latest"];

        for (const modelName of models) {
            console.log(`Checking model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✓ ${modelName} works!`);
                return;
            } catch (e) {
                console.log(`✗ ${modelName} failed: ${e.message.split('\n')[0]}`);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
