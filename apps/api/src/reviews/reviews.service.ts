import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(userId: string, productId: string, data: { rating: number; comment?: string }) {
        return this.prisma.review.create({
            data: {
                userId,
                productId,
                rating: data.rating,
                comment: data.comment,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });
    }

    async getProductReviews(productId: string) {
        return this.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getProductRating(productId: string) {
        const aggregate = await this.prisma.review.aggregate({
            where: { productId },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });

        return {
            averageRating: aggregate._avg.rating || 0,
            totalReviews: aggregate._count.rating,
        };
    }
}
