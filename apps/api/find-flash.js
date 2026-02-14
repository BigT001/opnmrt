const axios = require('axios');
require('dotenv').config();

async function findModel() {
    const apiKey = "AIzaSyDC3-6dWJCgxkqWYmK5efKKcp5GzhhDJEw";
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    try {
        const response = await axios.get(url);
        const models = response.data.models;
        const flash15 = models.find(m => m.name.includes('1.5-flash'));
        const flash20 = models.find(m => m.name.includes('2.0-flash'));
        const flash25 = models.find(m => m.name.includes('2.5-flash'));

        console.log('1.5-flash found:', flash15 ? flash15.name : 'NO');
        console.log('2.0-flash found:', flash20 ? flash20.name : 'NO');
        console.log('2.5-flash found:', flash25 ? flash25.name : 'NO');

        // Also list all that include 'flash'
        console.log('All Flash models:', models.filter(m => m.name.includes('flash')).map(m => m.name));
    } catch (error) {
        console.error('Error:', error.message);
    }
}
findModel();
