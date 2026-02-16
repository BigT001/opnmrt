import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private cache = new Map<string, { data: any; timestamp: number }>();
    private CACHE_TTL = 1000 * 60 * 60; // 1 hour

    // Models to try in order of priority/availability
    private readonly MODELS = [
        'gemini-flash-latest',    // User requested priority 1
        'gemini-2.5-flash',       // User requested priority 2
        'gemini-flash-lite-latest', // User requested priority 3
        'gemini-1.5-flash',       // Standard fallback
        'gemini-1.5-flash-latest',
        'gemini-2.0-flash-exp',
        'gemini-1.5-pro',
        'gemini-pro'
    ];

    private queue: Promise<void> = Promise.resolve();
    private lastRequestTime = 0;
    private initError = '';

    private isCircuitBroken = false;
    private circuitBreakerTimer: NodeJS.Timeout | null = null;

    constructor(private prisma: PrismaService) {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Testing gemini-1.5-flash again with full prefix as it is the most stable free tier model
            this.model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_NONE' as any },
                    { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_NONE' as any },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
                ]
            });
            console.log('[AI_INIT] BigT initialized with gemini-1.5-flash (Safety: NONE)');
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

    private async executeWithQueue<T>(operation: () => Promise<T>, isRetryable = true): Promise<T> {
        const task = this.queue.then(async () => {
            if (this.isCircuitBroken && !isRetryable) {
                throw new Error('Circuit broken: Rate limits exceeded');
            }

            const timeSinceLast = Date.now() - this.lastRequestTime;
            // Spacing out requests more for free tier (5 seconds minimum)
            if (timeSinceLast < 5000) {
                await new Promise(resolve => setTimeout(resolve, 5000 - timeSinceLast));
            }

            const maxRetries = isRetryable ? 5 : 1;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    this.lastRequestTime = Date.now();
                    const result = await operation();
                    return result;
                } catch (error: any) {
                    this.lastRequestTime = Date.now();
                    const status = error?.status || error?.response?.status;

                    // Specific check for 429
                    if ((status === 429 || error?.message?.includes('429') || error?.message?.includes('rate limit')) && attempt < maxRetries) {
                        this.breakCircuit(); // Temporarily pause background tasks

                        // Extract retry delay from error if possible (handling different SDK error formats)
                        let retryDelaySeconds = attempt * 20;

                        const errorStr = JSON.stringify(error) || String(error);
                        if (errorStr.includes('retryDelay')) {
                            // Match "56s" or '56s' or just 56s
                            const match = errorStr.match(/retryDelay["']?:\s*["']?(\d+)s/i);
                            if (match) retryDelaySeconds = parseInt(match[1]) + 2;
                        }

                        console.warn(`[AI_QUEUE] Rate limited (429). Waiting ${retryDelaySeconds}s before attempt ${attempt + 1}/${maxRetries}`);
                        await new Promise(resolve => setTimeout(resolve, retryDelaySeconds * 1000));
                    } else {
                        throw error;
                    }
                }
            }
            console.error('[AI_QUEUE_FINAL_FAILURE]', { isRetryable });
            throw new Error('Max retries exceeded or fatal error');
        });
        this.queue = task.then(() => { }).catch(() => { });
        return task;
    }

    private breakCircuit() {
        if (this.isCircuitBroken) return;
        console.warn('[AI_CIRCUIT] Breaking circuit for 5 minutes due to rate limits.');
        this.isCircuitBroken = true;
        if (this.circuitBreakerTimer) clearTimeout(this.circuitBreakerTimer);
        this.circuitBreakerTimer = setTimeout(() => {
            console.log('[AI_CIRCUIT] Circuit reset. Resuming background background tasks.');
            this.isCircuitBroken = false;
        }, 5 * 60 * 1000); // 5 minutes
    }

    private async generateWithRetry(prompt: string) {
        const errors: string[] = [];

        for (const modelName of this.MODELS) {
            try {
                // console.log(`[AI_ATTEMPT] Trying model: ${modelName}`);
                const model = this.genAI!.getGenerativeModel({
                    model: modelName,
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_HATE_SPEECH' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT' as any, threshold: 'BLOCK_NONE' as any },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT' as any, threshold: 'BLOCK_NONE' as any },
                    ]
                });
                const result = await model.generateContent(prompt);

                // Simple validation
                if (!result.response) throw new Error('Empty response');

                console.log(`[AI_SUCCESS] generation succeeded with ${modelName}`);
                return result;
            } catch (e: any) {
                // If it's a rate limit (429), we might want to panic, but for now we just try next model
                // console.warn(`[AI_FAIL] ${modelName} failed: ${e.message}`);
                errors.push(`${modelName}: ${e.message}`);
            }
        }

        throw new Error(`All models failed. Details: ${errors.join(' | ')}`);
    }

    getStatus() {
        return {
            ready: this.isReady(),
            circuitBroken: this.isCircuitBroken,
            initError: this.initError,
            model: 'gemini-2.0-flash-lite'
        };
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
        const userMsg = await (this.prisma as any).aiMessage.create({
            data: {
                conversationId: conversation.id,
                role: 'user',
                content: message
            }
        });

        // 3. Generate Response
        return this.executeWithQueue(async () => {
            try {
                // Manually add the new message to the history for the prompt
                const historyForPrompt = [...conversation.messages, userMsg];

                // If it's the first message, maybe update the title
                if (conversation.messages.length === 0) {
                    await (this.prisma as any).aiConversation.update({
                        where: { id: conversation.id },
                        data: { title: message.slice(0, 30) + (message.length > 30 ? '...' : '') }
                    });
                }

                const recentMessagesArr = historyForPrompt.slice(-11); // Include the latest user message
                const recentMessages = recentMessagesArr.map(m => `${m.role}: ${m.content}`).join('\n');

                // Smart greeting based on time and context
                const hour = new Date().getHours();
                let greeting = '';
                let timeOfDay = '';

                if (hour < 12) {
                    timeOfDay = 'morning';
                    greeting = 'Good morning';
                } else if (hour < 17) {
                    timeOfDay = 'afternoon';
                    greeting = 'Good afternoon';
                } else {
                    timeOfDay = 'evening';
                    greeting = 'Good evening';
                }

                // Proactive status summary for first message
                let proactiveGreeting = '';
                if (conversation.messages.length === 0) {
                    const alerts: string[] = [];
                    if (context.inventory?.outOfStockCount > 0) {
                        alerts.push(`${context.inventory.outOfStockCount} product${context.inventory.outOfStockCount > 1 ? 's are' : ' is'} out of stock`);
                    }
                    if (context.inventory?.lowStockCount > 0) {
                        alerts.push(`${context.inventory.lowStockCount} product${context.inventory.lowStockCount > 1 ? 's are' : ' is'} running low`);
                    }
                    if (context.inventory?.recentlyAddedCount > 0) {
                        alerts.push(`${context.inventory.recentlyAddedCount} new product${context.inventory.recentlyAddedCount > 1 ? 's' : ''} added recently`);
                    }

                    if (alerts.length > 0) {
                        proactiveGreeting = `\n\n**Quick Status:** ${alerts.join(', ')}.`;
                    }
                }

                const prompt = `
You are **BigT**, the AI-powered Store Manager for "${context.storeProfile?.name || 'this store'}".
You are NOT a generic chatbot. You are a **seasoned retail operations manager** with expertise in:
1. **Inventory Management** - tracking stock levels, restock timing, demand forecasting, NEW product launches
2. **Digital Marketing** - social media strategy, paid ads (Facebook/Instagram/Google Ads), SEO, email campaigns
3. **Sales Psychology** - pricing strategies, bundle deals, urgency tactics, upselling
4. **Customer Retention** - loyalty programs, follow-up strategies, review management
5. **Financial Analysis** - profit margins, cost optimization, revenue forecasting
6. **Trend Analysis** - identifying sales patterns, seasonal trends, product performance shifts

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

## PRODUCT INTELLIGENCE & CHANGE DETECTION:
${context.inventory?.recentlyAddedCount > 0 ? `
🎉 **NEW PRODUCTS DETECTED** (Added in last 7 days):
${JSON.stringify(context.inventory.recentlyAddedProducts)}

**Your Action**: When you see new products, PROACTIVELY:
1. Acknowledge them by name: "I see you've just added [Product Name] to the catalog!"
2. Analyze their initial stock levels
3. Suggest launch marketing strategies (social media announcement, email blast, bundle with existing products)
4. Set expectations for tracking their performance
` : ''}

**Product Monitoring Rules**:
- Track inventory.totalProducts count — if it changes between conversations, announce new additions
- Monitor recentlyAddedProducts array for products with recent addedAt timestamps
- Flag products with 0 sales after 7+ days as "underperforming" and suggest promotion tactics
- Identify "rising stars" (products with increasing sales velocity in timeline data)

---

## ADVANCED ANALYTICAL CAPABILITIES:

### Trend Detection:
- **Sales Velocity**: Compare last 7 days vs previous 7 days in timeline data to spot growth/decline
- **Product Performance**: Identify which products are gaining/losing traction
- **Seasonal Patterns**: Recognize day-of-week patterns (e.g., "Fridays are your strongest sales days")
- **Conversion Funnel**: Analyze sessions → views → cart → checkout ratios to find drop-off points

### Proactive Recommendations:
When you notice patterns, SPEAK UP:
- "I've noticed [Product X] sales dropped 40% this week — consider running a flash sale"
- "Your checkout abandonment is 60% — I recommend adding a 'Free Shipping' banner"
- "3 products are out of stock — you're losing potential revenue right now"

### Competitive Intelligence:
Suggest strategies based on e-commerce best practices:
- **Pricing Psychology**: ₦9,999 vs ₦10,000 (charm pricing)
- **Scarcity Tactics**: "Only 3 left!" badges for low-stock items
- **Social Proof**: "12 people bought this today" counters
- **Urgency**: Limited-time offers, countdown timers

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
                // Using multi-model retry strategy (user requested models + fallbacks)
                const result = await this.generateWithRetry(prompt);
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
                console.error(`[AI_CHAT_PROCESS_FATAL]`, {
                    message: error.message,
                    status: error.status,
                    details: error.response?.data?.error || error.details,
                    stack: error.stack?.substring(0, 200)
                });

                let errorMsg = `BigT is currently overwhelmed. Please wait a moment and try again.`;

                if (error?.message?.includes('suspicious activity')) {
                    errorMsg = "SYSTEM ALERT: Your Google Gemini API Key has been deactivated for suspicious activity. Please replace it in your .env file.";
                } else if (error?.message?.includes('All models failed')) {
                    errorMsg = "SYSTEM ALERT: All AI models are currently unavailable. Please check your API Key permissions and quota.";
                } else if (error?.status === 429 || error?.message?.includes('429')) {
                    errorMsg = "BigT is thinking too hard! (Rate Limit Exceeded). Please wait a moment.";
                }

                // CRITICAL: Save the error message to the DB so history is preserved and user knows why it failed
                const errAiMsg = await (this.prisma as any).aiMessage.create({
                    data: {
                        conversationId: conversation.id,
                        role: 'assistant',
                        content: `⚠️ **System Note**: ${errorMsg}`
                    }
                });

                return errAiMsg;
            }
        });
    }

    async getLiveAdvice(storeId: string, context: any) {
        if (!this.isReady()) return null;

        return this.executeWithQueue(async () => {
            try {
                // Focus on immediate, high-value actions
                const prompt = `
You are an AI store consultant. Based on this live data:
- Inventory: ${JSON.stringify(context.inventory?.snapshot ? context.inventory.snapshot.slice(0, 5) : [])}
- Low Stock: ${context.inventory?.lowStockCount} items
- Out of Stock: ${context.inventory?.outOfStockCount} items
- Top Products: ${JSON.stringify(context.topProducts ? context.topProducts.slice(0, 3) : [])}

Generate exactly 2 short, punchy, actionable advice snippets (max 15 words each).
Focus on: Urgent Restocks, Price Adjustments, or Promotion Opportunities.
Return a plain JSON array of strings. Example: ["Restock 'Blue Shirt' - losing ~$50/day.", "Bundle 'Socks' with 'Shoes' to clear stock."].
                `;

                const result = await this.generateWithRetry(prompt);
                const text = result.response.text();
                const cleanJson = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanJson);
            } catch (error) {
                console.error('[LIVE_ADVICE_ERROR]', error);
                return ["Review your low stock items.", "Check daily sales velocity."];
            }
        }, false); // Not retryable to keep it fast
    }

    async generateInsights(storeData: any) {
        if (!this.isReady()) return [];
        const cacheKey = `insights_${storeData.storeId || 'default'}`;
        const cached = this.getCached(cacheKey);
        if (cached) return cached;

        return this.executeWithQueue(async () => {
            try {
                const prompt = `Analyze store data and provide 3-5 JSON insights: ${JSON.stringify(storeData)}. Keys: title, description, impact, type.`;
                const result = await this.generateWithRetry(prompt);
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
                const result = await this.generateWithRetry(prompt);
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
                const result = await this.generateWithRetry(prompt);
                return result.response.text();
            } catch (e: any) { return "Error: " + e.message; }
        });
    }
}
