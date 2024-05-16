import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constant/constants';
import { LocalStrategy } from 'src/auth/local/local.strategy';
import { JwtStrategy } from 'src/auth/jwt/jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret, // ตรวจสอบว่ามีการกำหนดค่า secret key ให้ถูกต้อง
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
