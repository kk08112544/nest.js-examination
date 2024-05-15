import { IsNotEmpty, Matches } from "class-validator"

export class CreateUserDto {

    @IsNotEmpty()
    name: string
  
    @IsNotEmpty()
    lastname: string
  
    @IsNotEmpty()
    username: string
  
    @IsNotEmpty()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$])[A-Za-z\d@#$]{8,}$/, {
        message: "Password must be minimum eight characters, at least one letter, one number, and one special character"
    })
    password: string

    @IsNotEmpty()
    img:string
  
    @IsNotEmpty()
    role_id: number
  }