import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicPostsModule } from './public.posts/public.posts.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './public.posts/entities/public.post.entity';
import { User } from './user/entities/user.entity';
import { FileModule } from './file/file.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      url: 'postgres://posts:38S2GPNZut4Tmvan@dev.opensource-technology.com:5523/posts?sslmode=disable',
      entities: [Post, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    PublicPostsModule, AuthModule, UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
