import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get('product/:productId')
    async getProductReviews(@Param('productId') productId: string) {
        return this.reviewsService.getProductReviews(productId);
    }

    @Get('rating/:productId')
    async getProductRating(@Param('productId') productId: string) {
        return this.reviewsService.getProductRating(productId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':productId')
    async createReview(
        @GetUser('userId') userId: string,
        @Param('productId') productId: string,
        @Body() body: { rating: number; comment?: string }
    ) {
        return this.reviewsService.createReview(userId, productId, body);
    }
}
