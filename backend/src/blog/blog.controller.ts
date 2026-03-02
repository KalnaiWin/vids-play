import { PostRepository } from './blog.repository';
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
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostService } from './blog.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Blog } from './blog.schema';
import type { Request } from 'express';
import { InputUploadBlog } from './blog.dto';
import {
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('blog')
export class PostController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private postService: PostService,
    private postRepository: PostRepository,
  ) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image_blog'))
  @Post('upload')
  async uploadPost(
    @Req() req: Request,
    @Body() data: InputUploadBlog,
    @UploadedFile() imageBlog?: Express.Multer.File,
  ) {
    const userId = req.user?.userId;
    if (!userId) return { message: 'UserID not found' };
    return await this.postService.uploadBlog(userId, data, imageBlog);
  }

  @Get(':id')
  async getBlogs(@Param('id') authorId: string) {
    if (!authorId) return { message: 'AuthorId not found' };
    return await this.postRepository.getBlogsForOthers(authorId);
  }

  @UseGuards(AuthGuard)
  @Delete('del/:id')
  async deleteBlog(@Param('id') blogId: string, @Req() req: Request) {
    const authorId = req.user?.userId;
    if (!authorId) return { messgae: 'AuthorId not found' };
    return await this.postService.deleteBlog(blogId, authorId);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image_blog'))
  @Put('edit/:id')
  async editBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
    @Body() data: InputUploadBlog,
    @UploadedFile() imageBlog?: Express.Multer.File,
  ) {
    const authorId = req.user?.userId;
    if (!authorId) return { messgae: 'AuthorId not found' };
    return await this.postService.editBlog(blogId, authorId, data, imageBlog);
  }
}
