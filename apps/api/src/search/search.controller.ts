import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('search')
@UseGuards(AuthGuard('jwt'))
export class SearchController {
    constructor(private searchService: SearchService) { }

    @Get('global')
    async globalSearch(
        @Query('storeId') storeId: string,
        @Query('q') query: string,
    ) {
        return this.searchService.globalSearch(storeId, query);
    }
}
