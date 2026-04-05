import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Request } from 'express';
import { InputPostComment } from './comment.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentRepository } from './comment.repository';
import type { Express } from 'express';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private commentRepository: CommentRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('post/:id')
  @UseInterceptors(FileInterceptor('imageCmt'))
  async postComment(
    @Req() req: Request,
    @Body() data: InputPostComment,
    @Param('id') id: string,
    @UploadedFile() imageCmt?: Express.Multer.File,
  ) {
    const userId = req.user?.userId;
    if (!userId) return { messge: 'UserId not found' };
    if (!id) return { message: 'This blog or video not found' };
    if (data.onModel === 'Video') {
      return await this.commentService.postCommentVideo(
        userId,
        data.content,
        id,
        imageCmt,
      );
    } else if (data.onModel === 'Blog') {
      return await this.commentService.postCommentBlog(
        userId,
        data.content,
        id,
        imageCmt,
      );
    }
    throw new BadRequestException('Invalid onModel');
  }

  @UseGuards(AuthGuard)
  @Delete('del/:commentId')
  async deleteComment(
    @Req() req: Request,
    @Param('commentId') commentId: string,
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserId not found' };
    return await this.commentService.deleteComment(userId, commentId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async fetchComments(@Param('id') id: string) {
    if (!id) return { message: 'BlogId or VideoId not found' };
    return await this.commentRepository.getComments(id);
  }
}
