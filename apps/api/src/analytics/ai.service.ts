import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private cache = new Map<string, { data: any; timestamp: number }>();
    private CACHE_TTL = 1000 * 60 * 60; // 1 hour

    private queue: Promise<void> = Promise.resolve();
    private lastRequestTime = 0;
    private initError = '';

    constructor(private prisma: PrismaService) {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Using 2.5-flash - confirmed available
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
            console.log('[AI_INIT] BigT initialized with gemini-2.5-flash');
        } else {
            this.initError = 'GEMINI_API_KEY is missing or invalid.';
        }
    }

    private isReady() {
        return !!this.model;
    }

    private getCached(key: string) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            return cached.data;
        }
        return null;
    }

    private setCache(key: string, data: any) {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    private async executeWithQueue<T>(operation: () => Promise<T>): Promise<T> {
        const task = this.queue.then(async () => {
            const timeSinceLast = Date.now() - this.lastRequestTime;
            if (timeSinceLast < 1000) {
                await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLast));
            }

            try {
                this.lastRequestTime = Date.now();
                return await operation();
            } catch (error: any) {
                this.lastRequestTime = Date.now();
                throw error;
            }
        });
        this.queue = task.then(() => { }).catch(() => { });
        return task;
    }

    async getConversations(storeId: string) {
        return await (this.prisma as any).aiConversation.findMany({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } }
        });
    }

    async createConversation(storeId: string, title: string = 'New Analysis') {
        return await (this.prisma as any).aiConversation.create({
            data: { storeId, title },
            include: { messages: true }
        });
    }

    async getLatestConversation(storeId: string) {
        let conversation = await (this.prisma as any).aiConversation.findFirst({
            where: { storeId },
            orderBy: { updatedAt: 'desc' },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) {
            conversation = await this.createConversation(storeId, 'Initial Analysis');
        }
        return conversation;
    }

    async processUserMessage(storeId: string, message: string, context: any, conversationId?: string) {
        if (!this.isReady()) return { role: 'assistant', content: `BigT is offline. (${this.initError})` };

        // 1. Get/Create Conversation
        let conversation;
        if (conversationId) {
            conversation = await (this.prisma as any).aiConversation.findUnique({
                where: { id: conversationId },
                include: { messages: { orderBy: { createdAt: 'asc' } } }
            });
        }

        if (!conversation) {
            conversation = await this.getLatestConversation(storeId);
        }

        // 2. Save User Message
        await (this.prisma as any).aiMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'user',
                content: message
            }
        });

        // 3. Generate Response
        return this.executeWithQueue(async () => {
            try {
                // If it's the first message, maybe update the title
                if (conversation.messages.length === 0) {
                    await (this.prisma as any).aiConversation.update({
                        where: { id: conversation.id },
                        data: { title: message.slice(0, 30) + '...' }
                    });
                }

                const recentMessages = conversation.messages.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n');

                // ... (rest of the prompt logic stays the same but with larger history)
                const prompt = `
You are **BigT**, the AI-powered Store Manager for "${context.storeProfile?.name || 'this store'}".
You are NOT a generic chatbot. You are a **seasoned retail operations manager** with expertise in:
1. **Inventory Management** - tracking stock levels, restock timing, demand forecasting
2. **Digital Marketing** - social media strategy, paid ads (Facebook/Instagram/Google Ads), SEO, email campaigns
3. **Sales Psychology** - pricing strategies, bundle deals, urgency tactics, upselling
4. **Customer Retention** - loyalty programs, follow-up strategies, review management
5. **Financial Analysis** - profit margins, cost optimization, revenue forecasting

---

## STORE DATA (Live from database):
**Sales & Revenue:** ${JSON.stringify({ totalOrders: context.totalOrders, totalRevenue: context.totalRevenue, totalProducts: context.totalProducts })}

**Top Products:** ${JSON.stringify(context.topProducts || [])}

**Sales Funnel:** ${JSON.stringify(context.funnel || {})}

**Inventory Snapshot:**
${JSON.stringify(context.inventory || { note: 'No inventory data available yet' })}

**Store Profile:**
${JSON.stringify(context.storeProfile || {})}

**30-Day Sales Timeline:** ${JSON.stringify((context.timeline || []).slice(-7))}

---

## MARKETING STRATEGY KNOWLEDGE:
When the owner asks about marketing, traffic, or getting more customers, draw from these strategies:

### Free/Low-Cost Marketing:
- **Social Media Content Calendar**: Suggest specific post types (product showcases, behind-the-scenes, customer testimonials, unboxing videos)
- **Instagram/TikTok Reels**: Short product demos, trending audio, before/after transformations
- **WhatsApp Status Marketing**: Daily product highlights, flash sales announcements
- **SEO Basics**: Blog content, product descriptions optimization, Google My Business
- **Email Marketing**: Abandoned cart recovery, new arrival notifications, loyalty rewards
- **Referral Programs**: "Share & earn" discounts for existing customers

### Paid Advertising (when budget allows):
- **Facebook/Instagram Ads**: Suggest audience targeting (interests, demographics, lookalike audiences)
- **Google Shopping Ads**: Product listing ads for high-intent buyers
- **Influencer Partnerships**: Micro-influencers (1K-10K followers) for authentic promotion
- **Retargeting Campaigns**: Show ads to people who visited but didn't buy

### Seasonal/Event Marketing:
- **Flash Sales**: Limited-time offers to create urgency
- **Holiday Campaigns**: Valentine's, Black Friday, Christmas, Eid, etc.
- **Bundle Deals**: "Buy 2 Get 1 Free" or themed product bundles
- **Loyalty Points**: Reward repeat customers

---

## INVENTORY INTELLIGENCE:
When asked about stock, restocking, or inventory:
- Check the "inventory" data above for lastRestockedAt dates
- If lastRestockedAt is null, say "We don't have a recorded restock date for this product yet, but from now on every restock will be tracked automatically"
- Warn about low-stock products proactively
- Suggest restock quantities based on sales velocity
- If a product has 0 stock, flag it URGENTLY as lost revenue

---

## TRUTHFULNESS & DATA INTEGRITY (STRICT RULES):
- **NEVER assume or fabricate data.** If the "STORE DATA" above is missing a piece of information, EXPLICITLY state that you don't have that data yet.
- **NO MOCK DATA.** Do not use placeholders like "12.5% increase" or "yesterday was great" if the numbers aren't in the context.
- **Zero Hallucination Policy**: If you don't see a specific restock event in 'inventory.recentStockEvents', say "I don't have a record of a recent restock for this item in my logs."
- **Data-Driven Only**: Every claim about sales, trends, or stock MUST be backed by the JSON data provided in the context.

---

## CONVERSATION RULES:
- **Tone**: Professional but warm. Like a trusted business partner, not a robot.
- **Be Specific**: Don't say "you should market more". Say "Post a 15-second Reel of your top product [name] with the trending audio [X] — products like this get 3x more engagement on Instagram"
- **Use Real Data**: Reference actual numbers from the context above. If a number is 0, address it as 0.
- **Be Proactive**: If you see low stock or a sales drop in the REAL data, mention it.
- **Emojis**: Use sparingly (1-2 per message max)
- **Length**: Keep answers concise but actionable. Use bullet points for lists.
- **Markdown**: Use bold, headers, and lists for readability

---

Recent Chat History:
${recentMessages}

User's Current Message: "${message}"

Respond as BigT the Manager. Be 100% factual, data-driven, and actionable. If data is missing, admit it and suggest how we can start tracking it.
`;
                // (Note: Re-using the same prompt structure but with more history)
                const result = await this.model.generateContent(prompt);
                const responseText = result.response.text();

                const aiMsg = await (this.prisma as any).aiMessage.create({
                    data: {
                        conversationId: conversation.id,
                        role: 'assistant',
                        content: responseText
                    }
                });

                return aiMsg;
            } catch (error: any) {
                // ... error handling
                return { role: 'assistant', content: "Error processing message" };
            }
        });
    }

    async getLiveAdvice(storeId: string, context: any) {
        if (!this.isReady()) return null;

        return this.executeWithQueue(async () => {
            try {
                const prompt = `
                You are BigT's real-time advice engine. Analyze this store data and provide 3-5 very short, actionable bullets of advice or alerts.
                Be direct. No fluff. Use emojis.
                
                Context: ${JSON.stringify({
                    revenue: context.totalRevenue,
                    orders: context.totalOrders,
                    inventory: context.inventory?.lowStockCount,
                    topProducts: context.topProducts?.slice(0, 3)
                })}
                
                Format: JSON array of strings.
                `;

                const result = await this.model.generateContent(prompt);
                const text = result.response.text();
                const cleanJson = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (error) {
                return ["Keep an eye on today's traffic.", "Great time to check your top products."];
            }
        });
    }

    async generateInsights(storeData: any) {
        if (!this.isReady()) return [];
        const cacheKey = `insights_${storeData.storeId || 'default'}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        return this.executeWithQueue(async () => {
            try {
                const prompt = `Analyze store data and provide 3-5 JSON insights: ${JSON.stringify(storeData)}. Keys: title, description, impact, type.`;
                const result = await this.model.generateContent(prompt);
                const text = result.response.text();
                const cleanJson = text.replace(/```json|```/g, '').trim();
                const data = JSON.parse(cleanJson);
                this.setCache(cacheKey, data);
                return data;
            } catch (error) {
                return [];
            }
        });
    }

    async getPredictions(storeData: any) {
        if (!this.isReady()) return { nextMonthRevenue: 0, growthConfidence: 0, predictedHighDemand: [] };
        const cacheKey = `predictions_${storeData.storeId || 'default'}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        return this.executeWithQueue(async () => {
            try {
                const prompt = `Predict for 30 days based on: ${JSON.stringify(storeData)}. Return JSON: { "nextMonthRevenue": number, "growthConfidence": number, "predictedHighDemand": string[] }`;
                const result = await this.model.generateContent(prompt);
                const text = result.response.text();
                const cleanJson = text.replace(/```json|```/g, '').trim();
                const data = JSON.parse(cleanJson);
                this.setCache(cacheKey, data);
                return data;
            } catch (error) {
                return { nextMonthRevenue: 0, growthConfidence: 0, predictedHighDemand: [] };
            }
        });
    }

    async askQuestion(question: string, context: any) {
        if (!this.isReady()) return `BigT is offline. (${this.initError})`;
        return this.executeWithQueue(async () => {
            try {
                const prompt = `You are BigT. Question: "${question}". Context: ${JSON.stringify(context)}. Short answer.`;
                const result = await this.model.generateContent(prompt);
                return result.response.text();
            } catch (e: any) { return "Error: " + e.message; }
        });
    }
}
