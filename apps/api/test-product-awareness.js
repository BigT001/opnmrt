// Quick test to demonstrate BigT's new product awareness
const http = require('http');
const { PrismaClient } = require('@prisma/client');

async function testProductAwareness() {
    const prisma = new PrismaClient();

    try {
        // 1. Find a store
        const store = await prisma.store.findFirst();
        if (!store) {
            console.log('No stores found');
            return;
        }
        console.log('✓ Found store:', store.name, '(', store.id, ')');

        // 2. Check current inventory snapshot
        console.log('\n📦 Fetching inventory snapshot...');
        const products = await prisma.product.findMany({
            where: { storeId: store.id },
            select: { id: true, name: true, stock: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 5,
        });

        console.log(`\n📊 Current Products (${products.length} total):`);
        products.forEach((p, i) => {
            const age = Math.floor((Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
            console.log(`${i + 1}. ${p.name} - ${p.stock} units (${age} days old)`);
        });

        // 3. Check recent events
        console.log('\n📡 Recent Events:');
        const events = await prisma.eventLog.findMany({
            where: { storeId: store.id },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        events.forEach((e, i) => {
            const payload = e.payload as any;
            console.log(`${i + 1}. ${e.eventType} - ${payload?.productName || payload?.customerName || 'N/A'}`);
        });

        // 4. Test AI chat with product awareness
        console.log('\n🤖 Testing BigT AI Chat...');
        const data = JSON.stringify({
            storeId: store.id,
            message: 'What products do we have?'
        });

        const options = {
            hostname: '127.0.0.1',
            port: 4000,
            path: '/api/analytics/ai-chat/message',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
            },
        };

        return new Promise((resolve) => {
            const req = http.request(options, (res) => {
                let body = '';
                res.on('data', (chunk) => body += chunk);
                res.on('end', () => {
                    console.log('\n💬 BigT Response:');
                    try {
                        const parsed = JSON.parse(body);
                        console.log(parsed.content?.substring(0, 500) + '...');
                    } catch (e) {
                        console.log('Status:', res.statusCode);
                        console.log(body.substring(0, 300));
                    }
                    resolve(undefined);
                });
            });

            req.on('error', (e) => {
                console.error('Request Error:', e.message);
                resolve(undefined);
            });
            req.write(data);
            req.end();
        });

    } finally {
        await prisma.$disconnect();
    }
}

console.log('🚀 BigT Product Awareness Test\n');
console.log('This test demonstrates:');
console.log('1. Product inventory tracking');
console.log('2. Event system monitoring');
console.log('3. AI awareness of product catalog\n');
console.log('─'.repeat(50) + '\n');

testProductAwareness().catch(console.error);
