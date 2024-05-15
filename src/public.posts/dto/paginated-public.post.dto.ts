import { IsBoolean, IsNumber, IsString,  IsOptional } from 'class-validator';

export class PaginatedPostDto{

    @IsBoolean()
    @IsOptional()
    published: boolean

    @IsString()
    @IsOptional()
    page: number

    @IsString()
    @IsOptional()
    limit: number

    @IsString()
    @IsOptional()
    title: string

}