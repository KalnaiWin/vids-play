import { log } from 'console';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { InputPostComment } from './comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CommentRepository } from './comment.repository';

@Controller('comment')
export class CommentController {
  constructor(
    private commentService: CommentService,
    private commentRepository: CommentRepository,
  ) {}

  @UseGuards(AuthGuard)
  @Post('post/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'imageCmt',
        maxCount: 1,
      },
      {
        name: 'videoCmt',
        maxCount: 1,
      },
    ]),
  )
  async postComment(
    @Req() req: Request,
    @Body() data: InputPostComment,
    @Param('id') id: string,
    @UploadedFiles()
    files?: {
      videoCmt?: Express.Multer.File;
      imageCmt?: Express.Multer.File;
    },
  ) {
    const userId = req.user?.userId;
    if (!userId) return { messge: 'UserId not found' };
    if (!id) return { message: 'This blog or video not found' };
    if (data.onModel === 'Video') {
      return await this.commentService.postCommentVideo(
        userId,
        data.content,
        id,
        files?.imageCmt?.[0],
      );
    } else if (data.onModel === 'Blog') {
      return await this.commentService.postCommentBlog(
        userId,
        data.content,
        id,
        files?.videoCmt?.[0],
        files?.imageCmt?.[0],
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
