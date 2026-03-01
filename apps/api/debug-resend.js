const { Resend } = require('resend');
require('dotenv').config({ path: '../.env' });

const resend = new Resend(process.env.RESEND_API_KEY);

async function check() {
    try {
        const domains = await resend.domains.list();
        console.log('--- Domains found for this API Key ---');
        console.log(JSON.stringify(domains, null, 2));

        // Test a send request if possible or check verified domain
        const verifiedDomains = domains.data.filter(d => d.status === 'verified');
        console.log('\n--- Verified Domains ---');
        console.log(verifiedDomains.map(d => d.name));

    } catch (error) {
        console.error('Check Error:', error);
    }
}

check();
