import { IsNotEmpty } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @IsNotEmpty()
    @Column()
    name: string

    @IsNotEmpty()
    @Column()
    lastname: string
    
    @IsNotEmpty()
    @Column()
    username: string

    @IsNotEmpty()
    @Column()
    password: string

    @IsNotEmpty()
    @Column()
    img: string

}
