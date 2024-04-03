import { Module } from '@nestjs/common';
import { MyGateway } from './message.controller';
import { CustomLoggerModule } from 'src/utils/customLogger/CustomLogger.module';
import { ChatsModule } from 'src/chats/chats.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsService } from 'src/chats/chats.service';
import { PrismaService } from 'src/database/prisma.service';
import { MessageService } from './message.services';

@Module({
  imports: [CustomLoggerModule, ChatsModule, AuthModule],
  providers: [MyGateway, PrismaService, ChatsService, MessageService],
})
export class MessageModule {}
