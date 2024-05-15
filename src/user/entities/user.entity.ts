import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: number

    @Column()
    name: string

    @Column()
    lastname: string

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    img: string

    @Column()
    role_id: number

}
