import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomRepository } from './room.repository';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private roomRepository: RoomRepository,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Post('create')
  async createRoom(
    @Req() req: Request,
    @Body('title') title: string,
    @UploadedFile() thumbail: Express.Multer.File,
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.roomService.createRoom(userId, thumbail, title);
  }

  @UseGuards(AuthGuard)
  @Get('stream')
  async getAllRooms() {
    return await this.roomRepository.findAllStreamRooms();
  }

  @UseGuards(AuthGuard)
  @Get('/join/:id')
  async joinRoomStreaming(@Param('id') roomId: string, @Req() req: Request) {
    const userId = req.user?.userId;
    if (!userId) return { messgae: 'UserId not found' };
  }

  @UseGuards(AuthGuard)
  @Get('stream/:id')
  async getStreamingRoomsOfUSer(@Param('id') userId: string) {
    if (!userId) return { messgae: 'UserId not found' };
    return this.roomRepository.getStreamingRoomsOfUser(userId);
  }
}
