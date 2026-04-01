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
import { AuthGuard } from 'src/auth/auth.guard';
import { Blog } from './blog.schema';
import type { Request } from 'express';
import { InputUploadBlog } from './blog.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { BlogRepository } from './blog.repository';
import type { Express } from 'express';

@Controller('blog')
export class BlogController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    private blogService: BlogService,
    private blogRepository: BlogRepository,
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
    return await this.blogService.uploadBlog(userId, data, imageBlog);
  }

  @Get('channel/:id')
  async getBlogs(@Param('id') authorId: string) {
    if (!authorId) return { message: 'AuthorId not found' };
    return await this.blogRepository.getBlogsForOthers(authorId);
  }

  @Get(':id')
  async getBlogsDetail(@Param('id') blogId: string) {
    if (!blogId) return { message: 'AuthorId not found' };
    return (await this.blogRepository.getBlogDetail(blogId))[0];
  }

  @UseGuards(AuthGuard)
  @Delete('del/:id')
  async deleteBlog(@Param('id') blogId: string, @Req() req: Request) {
    const authorId = req.user?.userId;
    if (!authorId) return { messgae: 'AuthorId not found' };
    return await this.blogService.deleteBlog(blogId, authorId);
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
    return await this.blogService.editBlog(blogId, authorId, data, imageBlog);
  }

  @UseGuards(AuthGuard)
  @Put('react/:id')
  async toggleReactionBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
    @Body('type') type: 'like' | 'dislike',
  ) {
    const userId = req.user?.userId;
    if (!userId) return { messgae: 'UserId not found' };
    return await this.blogService.toggleReactionBlog(blogId, userId, type);
  }
}
