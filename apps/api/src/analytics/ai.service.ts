import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private cache = new Map<string, { data: any; timestamp: number }>();
    private CACHE_TTL = 1000 * 60 * 60; // 1 hour

    private queue: Promise<void> = Promise.resolve();
    private lastRequestTime = 0;
    private initError = '';

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY?.trim();
        if (apiKey && apiKey !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Using 2.5-flash - confirmed available for your API key
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
            // Only wait 1 second between requests
            if (timeSinceLast < 1000) {
                await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLast));
            }

            try {
                this.lastRequestTime = Date.now();
                const result = await operation();
                return result;
            } catch (error: any) {
                this.lastRequestTime = Date.now();
                throw error;
            }
        });

        this.queue = task.then(() => { }).catch(() => { });
        return task;
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
                console.error('[AI_INSIGHTS_ERROR]', error);
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
                console.error('[AI_PREDICTIONS_ERROR]', error);
                return { nextMonthRevenue: 0, growthConfidence: 0, predictedHighDemand: [] };
            }
        });
    }

    async askQuestion(question: string, context: any) {
        if (!this.isReady()) return `BigT is offline. (${this.initError})`;

        return this.executeWithQueue(async () => {
            try {
                const prompt = `You are BigT, a helpful store assistant. Question: "${question}". Context: ${JSON.stringify(context)}. Provide a short, friendly answer.`;
                const result = await this.model.generateContent(prompt);
                return result.response.text();
            } catch (error: any) {
                console.error('[BIGT_ERROR]', {
                    message: error?.message,
                    status: error?.status,
                    code: error?.code
                });

                // If there's a rate limit or quota issue
                if (error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
                    return "I'm experiencing temporary API limits. Please try again in a moment.";
                }

                // If model not found
                if (error?.message?.includes('404')) {
                    return `Model access error. Your API key may not have access to this model.`;
                }

                return `I encountered an issue: ${error?.message || 'Unknown error'}. Please try again.`;
            }
        });
    }
}
