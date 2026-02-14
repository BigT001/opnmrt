const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function debugAskQuestion() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const question = "hi";
    const context = { storeName: "samstar" };

    console.log('Testing askQuestion logic...');
    try {
        const prompt = `
        You are the OPNMRT AI Advisor. A seller is asking: "${question}".
        Use this store context to answer accurately: ${JSON.stringify(context)}.
        Keep answers short, helpful, and professional.
      `;
        console.log('Sending prompt to gemini-2.0-flash...');
        const result = await model.generateContent(prompt);
        console.log('Response received!');
        console.log('Text:', result.response.text());
    } catch (error) {
        console.error('--- ERROR DETECTED ---');
        console.error('Message:', error.message);
        console.error('Full Error:', JSON.stringify(error, null, 2));
    }
}

debugAskQuestion();
