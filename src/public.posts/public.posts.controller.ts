import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { DeletePublicPostDto } from './dto/delete-public.post.dto';
import { PaginatedPostDto } from './dto/paginated-public.post.dto';
import {Post as PostEntity } from './entities/public.post.entity';

@Controller('public.posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @Post('createPost')
  create(@Body() createPublicPostDto: CreatePublicPostDto) {
    return this.publicPostsService.create(createPublicPostDto);
  }

  @Get()
  findAll() {
    return this.publicPostsService.findAll();
  }

  @Post('classification')
  getPublishedPosts(@Body() paginatedPostDto: PaginatedPostDto,){
    const {published, page, limit, title} = paginatedPostDto;

    return this.publicPostsService.getPublishedPosts(published, page, limit, title);
  }

  @Post('getData/:id')
  findOne(@Param('id') id: string) {
    return this.publicPostsService.findOne(id);
  }

  @Patch('updateData/:id')
  update(@Param('id') id: string, @Body() updatePublicPostDto: UpdatePublicPostDto) {
    return this.publicPostsService.update(id, updatePublicPostDto);
  }

  @Delete('deleteData')
  remove(@Body() deletePublicPostDto: DeletePublicPostDto) {
    return this.publicPostsService.remove(deletePublicPostDto);
  }
}
