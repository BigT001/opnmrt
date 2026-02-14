const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');
const fs = require('fs');

// Try to find .env manually
const envPath = path.join(__dirname, '../.env');
console.log("Looking for .env at:", envPath);

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=["']?(.*?)["']?(\s|$)/);
    if (match && match[1]) {
        process.env.GEMINI_API_KEY = match[1];
        console.log("Found API Key!");
    }
}

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in process.env or .env file");
        return;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ['gemini-1.5-flash', 'gemini-1.5-flash-8b', 'gemini-1.5-pro', 'gemini-2.0-flash'];

    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("hi");
            const text = result.response.text();
            console.log(`[WORKING] ${m}: ${text.substring(0, 20)}...`);
        } catch (e) {
            console.log(`[FAIL] ${m}: ${e.message}`);
        }
    }
}

listModels();
