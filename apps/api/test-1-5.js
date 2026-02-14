const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testV1() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    const genAI = new GoogleGenerativeAI(apiKey);

    const models = ["gemini-1.5-flash", "gemini-1.5-flash-8b", "gemini-1.5-pro"];

    for (const m of models) {
        console.log(`Testing ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("hi");
            console.log(`✓ ${m} works!`);
        } catch (e) {
            console.log(`✗ ${m} failed: ${e.message.split('\n')[0]}`);
        }
    }
}
testV1();
