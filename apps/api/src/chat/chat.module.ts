import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatAiService } from './chat-ai.service';

@Module({
  imports: [ConfigModule],
  providers: [ChatService, ChatGateway, ChatAiService],
  controllers: [ChatController],
})
export class ChatModule { }
