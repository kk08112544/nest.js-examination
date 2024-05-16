import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username:string, password: string) : Promise<any>{
      const user = await this.userService.findOne(username)
      if(user && await bcrypt.compare(password,user.password)){
        const {...result} = user
        return result
      }

      return null
  }

  async login(user: any) : Promise<any> {
    const payload = { username: user.username, sub: user.id };
    const accesstoken = this.jwtService.sign(payload)
    user.accesstoken = accesstoken;
    return {
      user: user,
    };
  }
  
}
