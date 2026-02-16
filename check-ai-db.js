const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
    try {
        const conversations = await prisma.aiConversation.findMany({
            include: {
                _count: {
                    select: { messages: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        console.log('Conversations Found:', conversations.length);
        conversations.forEach(c => {
            console.log(`- [${c.id}] ${c.title || 'Untitled'}: ${c._count.messages} messages (Last updated: ${c.updatedAt})`);
        });

        if (conversations.length > 0) {
            const latest = conversations[0];
            const messages = await prisma.aiMessage.findMany({
                where: { conversationId: latest.id },
                orderBy: { createdAt: 'asc' }
            });
            console.log(`\nMessages for latest conversation [${latest.id}]:`);
            messages.forEach(m => {
                console.log(`  [${m.role}] ${m.content.substring(0, 50)}...`);
            });
        }
    } catch (err) {
        console.error('Error checking DB:', err);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
