const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testGemini() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw"; // From your .env
    console.log('Testing Gemini with key:', apiKey.substring(0, 10) + '...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Say 'Gemini is working' if you can read this.";
        console.log('Sending prompt...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Gemini Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
        }
    }
}

testGemini();
