import { Controller, Get, Post, UseInterceptors, Res, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import * as path from "path";
import { Request } from 'express';
import { Req } from '@nestjs/common';


interface FileParams {
  img : string;
}


@Controller('file')
export class FileController {
  
  @Post("upload")
  @UseInterceptors(FileInterceptor('singleFile',{
    storage: diskStorage({
      destination: "./assets",
      filename: (req, file, cb) => {
        const extArray = file.mimetype.split("/");
        const extension = extArray[extArray.length-1];
        const newFilename = "Fileupload-"+Date.now()+"."+extension;
        req['uploadedFileName'] = newFilename; // เก็บชื่อไฟล์ที่อัปโหลดไว้ใน request object
        cb(null, newFilename)
      }
    })
  }))
  
  async uploadFile(@Req() req: Request) {
    const uploadedFileName = req['uploadedFileName'];
    console.log(uploadedFileName);
    return {"image": uploadedFileName }; // return ชื่อไฟล์ที่ถูกอัปโหลดในรูปแบบ JSON
  
  }

 

  @Get(':img')
  getFile(@Res() res: Response , @Param() file: FileParams) {
    res.sendFile(path.join(__dirname, "../../assets/" + file.img));
  }
}