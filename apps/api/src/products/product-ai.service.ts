import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductAiService {
    private genAI: GoogleGenerativeAI;
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

    constructor(private configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    private async generateWithRetry(parts: any[]) {
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

                // Add waiting for response inside the retry loop to ensure we catch all errors
                const result = await model.generateContent(parts);
                const response = await result.response;
                const text = response.text();

                if (!text) throw new Error('Empty response text');

                console.log(`[PRODUCT_AI_SUCCESS] Success with ${modelName}`);
                return text;
            } catch (e: any) {
                console.warn(`[PRODUCT_AI_ATTEMPT] Model ${modelName} failed: ${e.message}`);
                errors.push(`${modelName}: ${e.message}`);

                // Only wait if it's a rate limit error (429)
                if (e.message.includes('429')) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        throw new Error(`All models failed: ${errors.join(' | ')}`);
    }

    async analyzeProduct(data: {
        name: string;
        category: string;
        description: string;
        imageUrls: string[];
        storeName?: string;
        storeDescription?: string;
    }) {
        let imagePart: any = null;
        if (data.imageUrls && data.imageUrls.length > 0) {
            const firstImage = data.imageUrls[0];
            try {
                if (firstImage && firstImage.startsWith('data:')) {
                    const parts = firstImage.split(',');
                    const base64Content = parts.length > 1 ? parts[1] : parts[0];
                    const mimeType = firstImage.match(/:(.*?);/)?.[1] || 'image/jpeg';
                    imagePart = {
                        inlineData: {
                            data: base64Content,
                            mimeType,
                        },
                    };
                } else if (firstImage && firstImage.startsWith('http')) {
                    const response = await axios.get(firstImage, { responseType: 'arraybuffer' });
                    imagePart = {
                        inlineData: {
                            data: Buffer.from(response.data).toString('base64'),
                            mimeType: response.headers['content-type'] || 'image/jpeg',
                        },
                    };
                }
            } catch (e) {
                console.error('[PRODUCT_AI_SERVICE] Image extraction failed:', e.message);
            }
        }

        const prompt = `You are a helpful store manager for "${data.storeName || 'this store'}". 
${data.storeDescription ? `STORE CONTEXT: ${data.storeDescription}` : ''}

Your goal is to write a simple product description that anyone can understand. 

INPUT DATA:
- Product Name: "${data.name || 'Unknown Item'}"
- Category: "${data.category || 'Uncategorized'}"
- Current Description: "${data.description || 'No description provided'}"

YOUR MISSION:
1. "suggestedDescription": Write 1-2 short paragraphs. 
   - Use very simple English. No big words. Imagine a 12-year-old is reading it.
   - Explain why the product is good and how it helps the customer.
   - If there is an image, talk about what it looks like (color, size, feel) simply.
2. "suggestedCategory": Suggest a simple category for this product. 
3. "tags": Provide 5 simple words people use to search for this.

CORE IDENTITY:
- Tone: Friendly and simple.
- Purpose: Help people understand what the product is.
- Format: Return ONLY a raw JSON object. No markdown.

{
  "suggestedDescription": "...",
  "suggestedCategory": "...",
  "tags": ["...", "...", "...", "...", "..."]
}`;

        try {
            const contentParts: any[] = [prompt];
            if (imagePart) contentParts.push(imagePart);

            const text = await this.generateWithRetry(contentParts);

            console.log('[PRODUCT_AI_SERVICE] Raw AI Response Length:', text.length);

            // Robust JSON extraction
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('[PRODUCT_AI_SERVICE] No JSON found in response:', text);
                throw new Error('AI response did not contain a valid JSON object');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Basic validation of the response structure
            if (!parsed.suggestedDescription || !parsed.suggestedCategory || !parsed.tags) {
                throw new Error('AI response missing required fields');
            }

            return parsed;
        } catch (error) {
            console.error('[PRODUCT_AI_SERVICE] Critical AI Error:', error.message);

            // Fallback that reveals the error for debugging
            return {
                suggestedDescription: `[AI ERROR]: All models failed. Debug info: ${error.message}. Try enabling "Generative Language API" in Google Cloud Console.`,
                suggestedCategory: 'Error Trace',
                tags: ['error', 'debug', 'check-api-key']
            };
        }
    }
}
