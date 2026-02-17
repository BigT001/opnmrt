import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatAiService {
    private genAI: GoogleGenerativeAI | null = null;

    // User explicitly requested these models and priority. DO NOT CHANGE.
    private readonly MODELS = [
        'gemini-flash-latest',    // Priority 1
        'gemini-2.5-flash',       // Priority 2 (User requested)
        'gemini-flash-lite-latest', // Priority 3
        'gemini-1.5-flash',       // Standard fallback
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        } else {
            console.warn('[ChatAiService] GEMINI_API_KEY not found in configuration');
        }
    }

    private async generateWithRetry(parts: any[]) {
        if (!this.genAI) throw new Error('AI Service not initialized (missing API key)');
        const errors: string[] = [];

        for (const modelName of this.MODELS) {
            try {
                const model = this.genAI.getGenerativeModel({
                    model: modelName,
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.9,
                        topK: 40,
                        maxOutputTokens: 1000 // Increased to ensure responses are NOT cut off mid-sentence
                    }
                });

                // Slightly longer timeout for deep analysis
                const result = await Promise.race([
                    model.generateContent(parts),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 12000))
                ]) as any;

                if (!result.response) throw new Error('Empty response');
                const text = result.response.text();
                if (!text || text.trim().length === 0) throw new Error('Blank response');

                console.log(`[CHAT_AI_SUCCESS] generation succeeded with ${modelName}`);
                return text;
            } catch (e: any) {
                console.warn(`[CHAT_AI_ATTEMPT] Model ${modelName} failed: ${e.message}`);
                errors.push(`${modelName}: ${e.message}`);
            }
        }
        throw new Error(`All models failed: ${errors.join(' | ')}`);
    }

    async generateSupportResponse(data: {
        storeId: string;
        buyerId: string;
        messageHistory: any[];
        currentMessage: string;
    }) {
        // 1. Fetch Extensive Store Context
        const store = await this.prisma.store.findUnique({
            where: { id: data.storeId },
            include: {
                products: { take: 50, select: { id: true, name: true, price: true, description: true, stock: true, category: true } }
            }
        });

        // 2. Fetch Buyer Context (Orders & Details)
        const buyer = await this.prisma.user.findUnique({
            where: { id: data.buyerId },
            include: {
                orders: {
                    where: { storeId: data.storeId },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        items: { include: { product: { select: { name: true } } } }
                    }
                }
            }
        });

        const storeContext = `
STORE NAME: ${store?.name || 'this store'}
STORE BIO: ${store?.biography || 'A premium marketplace.'}
STORE SUBDOMAIN: ${store?.subdomain}
AVAILABLE PRODUCTS (Top 50 items):
${store?.products.map(p => `- ${p.name} [ID: ${p.id}]: ₦${p.price} (Stock: ${p.stock})`).join('\n')}
`;

        const buyerContext = `
BUYER NAME: ${buyer?.name || 'Customer'}
BUYER EMAIL: ${buyer?.email}
BUYER PHONE: ${buyer?.phone || 'Not provided'}
SHIPPING ADDRESS: ${buyer?.shippingAddress ? JSON.stringify(buyer.shippingAddress) : 'No address saved'}
ORDER HISTORY:
${buyer?.orders?.map(o => {
            const items = o.items?.map(i => `${i.quantity}x ${i.product.name}`).join(', ') || 'No items';
            return `- ORDER #${o.id.slice(-6)}:
  Status: ${o.status}
  Total: ₦${o.totalAmount}
  Items: ${items}
  Placed: ${o.createdAt.toLocaleDateString()}
  Last Update: ${o.updatedAt.toLocaleDateString()}`;
        }).join('\n') || 'No previous orders found.'}
`;

        const historyContext = data.messageHistory.map(m =>
            `${m.senderRole === 'BUYER' ? 'Customer' : 'Big T (Store Support)'}: ${m.content}`
        ).join('\n');

        const prompt = `
You are **Big T**, the real and dedicated customer support manager for **${store?.name}**. 

YOUR CORE IDENTITY (HUMAN & DIRECT):
- You work ONLY for **${store?.name}**.
- **NO REPETITIVE GREETINGS**: If the chat history shows you've already said "Hey" or used their name recently, DO NOT say it again. Just answer the question directly.
- **NO ROBOTIC POLITENESS**: Avoid phrases like "That's a great question!" or "I'd be happy to help." Just help.
- Talk like a busy but efficient store manager. Be punchy. Be real.

DYNAMIC LINKS (CRITICAL):
- Every time you mention a product, you MUST link it using this **EXACT** format:
- [Product Name](http://${store?.subdomain}.localhost:3000/store/${store?.subdomain}/products/PRODUCT_ID)

FORMATTING RULES:
1. **Bolding**: ALWAYS use double asterisks for bold text (e.g., **₦312,000**).
2. **Short & Punchy**: Keep responses under 3 sentences unless explaining a complex order.

DATA FOR THIS SESSION:
### STORE PROFILE:
${storeContext}

### CUSTOMER PROFILE:
${buyerContext}

### RECENT CHAT HISTORY (FOR CONTEXT):
${historyContext}

### THE CUSTOMER SAID:
"${data.currentMessage}"

Write your response as the manager of **${store?.name}**. 
CRITICAL: If you see a greeting in the history, SKIP the greeting now. Be direct.
`;

        try {
            return await this.generateWithRetry([{ text: prompt }]);
        } catch (error) {
            console.error('[CHAT_AI_ERROR]', error);
            return `Hey ${buyer?.name || 'there'}! Big T here. I'm seeing a lot of orders coming in, so my system is a bit slow. Let me check your ${buyer?.orders?.length ? 'order #' + buyer.orders[0].id.slice(-6) : 'details'} manually and I'll reply in just a minute!`;
        }
    }
}
