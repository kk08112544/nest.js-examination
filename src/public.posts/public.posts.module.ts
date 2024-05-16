import { Module } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { PublicPostsController } from './public.posts.controller';
import { Post } from './entities/public.post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PublicPostsController],
  providers: [PublicPostsService],
})
export class PublicPostsModule {}
