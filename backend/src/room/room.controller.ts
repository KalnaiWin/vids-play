import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { UserService } from 'src/user/user.service';

@Controller('room')
export class RoomController {
  constructor(
    private roomService: RoomService,
    private roomRepository: RoomRepository,
    private userService: UserService,
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
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Put('edit/:id')
  async editRoom(
    @Req() req: Request,
    @Param('id') roomId: string,
    @Body('title') title: string,
    @UploadedFile() thumbail: Express.Multer.File,
  ) {
    const userId = req.user?.userId;
    if (!userId || !roomId) return { message: 'UserId or RoomId not found' };
    return await this.roomService.editRoom(userId, thumbail, title, roomId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  @Delete('del/:id')
  async deleteRoom(@Req() req: Request, @Param('id') roomId: string) {
    const userId = req.user?.userId;
    if (!userId || !roomId) return { message: 'UserId or RoomId not found' };
    return await this.roomService.deleteRoom(roomId, userId);
  }

  @UseGuards(AuthGuard)
  @Get('stream')
  async getAllRooms() {
    return await this.roomRepository.findAllStreamRooms();
  }

  @Get('/join/:id')
  async joinRoomStreaming(@Param('id') roomId: string, @Req() req: Request) {
    if (!roomId) return { messgae: 'RoomId not found' };
    return (await this.roomRepository.getJoinedRoom(roomId))[0];
  }

  @Get('stream/:id')
  async getStreamingRoomsOfUSer(@Param('id') userId: string) {
    if (!userId) return { messgae: 'UserId not found' };
    return this.roomRepository.getStreamingRoomsOfUser(userId);
  }

  @UseGuards(AuthGuard)
  @Put('reaction/:id')
  async toggleReactionVideo(
    @Param('id') roomId: string,
    @Req() req: Request,
    @Body('type') reaction: 'like' | 'dislike',
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };

    return await this.userService.toggleReactionRoom(roomId, userId, reaction);
  }

  @UseGuards(AuthGuard)
  @Put('change-status/:id')
  async changeStatus(
    @Param('id') roomId: string,
    @Req() req: Request,
    @Body('status') status: 'LIVE' | 'WAITING' | 'STOP',
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.roomService.changeStatusRoom(userId, roomId, status);
  }
}
