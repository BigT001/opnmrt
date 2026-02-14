const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    console.log('Testing Gemini with key:', apiKey.substring(0, 10) + '...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Try the exact string from ai.service.ts
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('Model initialized. Sending prompt...');
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (error) {
        console.error('ERROR MESSAGE:', error.message);
        console.error('FULL ERROR:', error);
    }
}

testGemini();
