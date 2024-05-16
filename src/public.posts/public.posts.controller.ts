import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { DeletePublicPostDto } from './dto/delete-public.post.dto';
import { PaginatedPostDto } from './dto/paginated-public.post.dto';
import {Post as PostEntity } from './entities/public.post.entity';
import { LocalAuthGuard } from 'src/auth/local/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { DatePublicPostDto } from './dto/date-public.post.dto';

@Controller('public.posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('searchdate')
  searchDate(@Body() datePublicPostDto: DatePublicPostDto){
    return this.publicPostsService.findDate(datePublicPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createPost')
  create(@Body() createPublicPostDto: CreatePublicPostDto) {
    return this.publicPostsService.create(createPublicPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.publicPostsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('classification')
  getPublishedPosts(@Body() paginatedPostDto: PaginatedPostDto,){
    const {published, page, limit, title} = paginatedPostDto;

    return this.publicPostsService.getPublishedPosts(published, page, limit, title);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getData/:id')
  findOne(@Param('id') id: string) {
    return this.publicPostsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('updateData/:id')
  update(@Param('id') id: string, @Body() updatePublicPostDto: UpdatePublicPostDto) {
    return this.publicPostsService.update(id, updatePublicPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deleteData')
  remove(@Body() deletePublicPostDto: DeletePublicPostDto) {
    return this.publicPostsService.remove(deletePublicPostDto);
  }
}
