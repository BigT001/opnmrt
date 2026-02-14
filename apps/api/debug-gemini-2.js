const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    console.log('Testing Gemini 2.0 with key...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log('Model initialized. Sending prompt...');
        const result = await model.generateContent("Say 'Gemini 2.0 is alive!'");
        const response = await result.response;
        console.log('Response:', response.text());
    } catch (error) {
        console.error('ERROR MESSAGE:', error.message);
    }
}

testGemini();
