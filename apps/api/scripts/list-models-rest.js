const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function check() {
    const envPath = path.join(__dirname, '../.env');
    let apiKey = '';
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/GEMINI_API_KEY=["']?(.*?)["']?(\s|$)/);
        if (match) apiKey = match[1];
    }

    if (!apiKey) {
        console.error("No API Key");
        return;
    }

    console.log("Checking v1beta models...");
    try {
        const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        console.log("Available v1beta models:", res.data.models.map(m => m.name.replace('models/', '')));
    } catch (e) {
        console.error("v1beta list failed:", e.response?.data || e.message);
    }

    console.log("\nChecking v1 models...");
    try {
        const res = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
        console.log("Available v1 models:", res.data.models.map(m => m.name.replace('models/', '')));
    } catch (e) {
        console.error("v1 list failed:", e.response?.data || e.message);
    }
}

check();
