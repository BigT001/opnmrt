import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatAiService {
    private genAI: GoogleGenerativeAI | null = null;
    private readonly MODELS = [
        'gemini-2.0-flash-lite-preview-02-05',
        'gemini-2.0-flash-exp',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-flash-latest',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro'
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
                    ]
                });
                const result = await model.generateContent(parts);
                if (!result.response) throw new Error('Empty response');
                return result;
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
        // 1. Fetch Store Context
        const store = await this.prisma.store.findUnique({
            where: { id: data.storeId },
            include: {
                products: { take: 10, select: { name: true, price: true, description: true, stock: true } }
            }
        });

        // 2. Fetch Buyer Context (Orders)
        const buyer = await this.prisma.user.findUnique({
            where: { id: data.buyerId },
            include: {
                orders: {
                    where: { storeId: data.storeId },
                    orderBy: { createdAt: 'desc' },
                    take: 3,
                    include: { items: { include: { product: { select: { name: true } } } } }
                }
            }
        });

        const storeContext = `
STORE NAME: ${store?.name || 'this store'}
STORE BIO: ${store?.biography || 'A premium marketplace.'}
AVAILABLE PRODUCTS (Top 10):
${store?.products.map(p => `- ${p.name}: ₦${p.price} (${p.stock > 0 ? 'In Stock' : 'Out of Stock'})`).join('\n')}
`;

        const buyerContext = `
BUYER NAME: ${buyer?.name || 'Customer'}
RECENT ORDERS:
${buyer?.orders?.map(o => `- Order #${o.id.slice(-6)}: ${o.status}, Total: ₦${o.totalAmount}, Items: ${o.items?.map(i => i.product.name).join(', ') || 'Unknown Items'}`).join('\n') || 'No previous orders found.'}
`;

        const historyContext = data.messageHistory.map(m =>
            `${m.senderRole === 'BUYER' ? 'Customer' : 'Store'}: ${m.content}`
        ).join('\n');

        const prompt = `You are a real, human customer support representative for "${store?.name || 'this store'}".
Your goal is to provide warm, helpful, and extremely authentic customer support.

CRITICAL RULES:
1. IDENTITY: Never, under any circumstances, reveal that you are an AI. Do not use phrases like "As an AI model" or "I am a computer program." You are a human team member.
2. PRIVACY: Do NOT disclose any internal seller statistics, total sales, revenue, or private account details. If asked about the seller's success, keep it general (e.g., "The store is doing great!").
3. FOCUS: Only discuss information relevant to the customer: their orders, store products, inventory status (e.g., restocking soon), and shipping inquiries.
4. GRACEFUL FALLBACK: If a customer asks something you don't know or that is private, say "Let me check with the manager and get back to you shortly" or "I'll have someone from the team look into this and reach out soon."
5. TONE: Professional, warm, and natural. Use the customer's name (${buyer?.name || 'Customer'}) if available.

${storeContext}

${buyerContext}

CONVERSATION HISTORY:
${historyContext}

NEW MESSAGE FROM CUSTOMER:
"${data.currentMessage}"

RESPONSE (Natural, conversational, and short):`;

        try {
            const result = await this.generateWithRetry([{ text: prompt }]);
            return result.response.text();
        } catch (error) {
            console.error('[CHAT_AI_ERROR]', error);
            return "I'll have to check on that for you and get back to you shortly. Let me loop in the manager to make sure we give you the right info!";
        }
    }
}
