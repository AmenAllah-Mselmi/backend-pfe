import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() createChatDto: CreateChatDto) {
    try {
      return await this.chatsService.create(createChatDto);
    } catch (e: any) {
      console.error("Error creating chat:", e);
      if (e.code === 'P2025') {
        throw new HttpException('One or more users not found to connect to this chat', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(e.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  findAllForUser(@Param('userId') userId: string) {
    return this.chatsService.findAll(+userId);
  }

  @Get('global/:userId')
  findOrCreateGlobal(@Param('userId') userId: string) {
    return this.chatsService.findOrCreateGlobal(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }
}
