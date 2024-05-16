import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { Like } from 'typeorm';
import { Post } from './entities/public.post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { format } from 'date-fns-tz';
import { DeletePublicPostDto } from './dto/delete-public.post.dto';
import { Between } from 'typeorm';
import { DatePublicPostDto } from './dto/date-public.post.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';


@Injectable()
export class PublicPostsService {
   
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ){}

  async create(createPublicPostDto: CreatePublicPostDto) {
    if(!createPublicPostDto.title){
      throw new HttpException({ error: 'Title is required' }, HttpStatus.BAD_REQUEST);
    }else if(!createPublicPostDto.content){
      throw new HttpException({error:'Content is required'}, HttpStatus.BAD_REQUEST);
    }

    try{
      const post = await this.postRepository.create(createPublicPostDto);
      await this.postRepository.save(post);

      const {id, title, content, published, created_at} = post;
      const formattedCreatedAt = format(created_at,'yyyy-MM-dd\' T \'HH:mm:ss',{timeZone: 'Asia/Bangkok'});

      return {
        id,
        title,
        content,
        published,
        created_at: formattedCreatedAt,
      }
    }catch(error){
      throw new HttpException({error: 'error message'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  findAll() {
    const currentTime = new Date();
  
    return this.postRepository.find()
      .then(finds => {
        const formattedFinds = finds.map(post => {
          const formattedCreatedAt = format(post.created_at, "yyyy-MM-dd 'T' HH:mm:ss", { timeZone: 'Asia/Bangkok' });
          const formattedUpdatedAt = format(post.updated_at, "yyyy-MM-dd 'T' HH:mm:ss", { timeZone: 'Asia/Bangkok' });
  
          return {
            ...post,
            created_at: formattedCreatedAt,
            updated_at: formattedUpdatedAt
          };
        });
  
        return formattedFinds;
      })
      .catch(error => {
        console.error("Error occurred:", error);
        throw error;
      });
  }

  async findDate(datePublicPostDto: DatePublicPostDto) {

    if (datePublicPostDto === undefined) {
      return 'Please provide a date';
    }

    const { created_at } = datePublicPostDto;

    try {
      const searchData = await this.postRepository.createQueryBuilder("post")
        .select(["post.id", "post.title", "post.content","post.created_at","post.updated_at"]) 
        .where("DATE(post.created_at) = :date", { date: created_at })
        .getMany();

      const formattedData = searchData.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: format(new Date(post.created_at), "yyyy-MM-dd' T 'HH:mm:ss"), 
        updated_at: format(new Date(post.updated_at), "yyyy-MM-dd' T 'HH:mm:ss"), 
    }));
    
    return formattedData;
    } catch (error) {
      console.error("Error fetching data by date:", error);
      throw new Error("Could not fetch data by date");
    }
  }
  
  async getPublishedPosts(published: boolean, page: number, limit: number, title: string): Promise<any>{
    if (published === undefined && page === undefined && title === undefined && limit === undefined) {
      return "content is not empty";
    }
    let pageNumber = isNaN(page) || page < 1 ? 1 : page;
    let limitNumber = isNaN(limit) || limit < 1 ? 10 : limit;


    const skip = (pageNumber - 1) * limitNumber;

    const where: any = { published };
    if(title && title.trim() !== ""){
      where.title = Like(`%${title}%`);
    }

    try{

      const [posts, totalCount] = await this.postRepository.findAndCount({
        where,
        take: limitNumber,
        skip: skip > 0 ? skip : 0,
      })

      const totalPages = Math.ceil(totalCount / limitNumber)

      return {
        posts,
        count: totalCount,
        limit: limitNumber,
        page: pageNumber,
        total_page: totalPages,
      }
    }catch(error){
      console.error("Error fetching published posts:" , error);
      throw new Error("Could not fetch published posts");
    }
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      select: ['id', 'title', 'content', 'published', 'created_at', 'view_count'],
    });

    if(!post){
      return {"Message" : "Not Found this post"}
    }

    if(post && post.created_at){
      const formattedCreatedAt = format(post.created_at,"yyyy-MM-dd ' T ' HH:mm:ss " , {timeZone: 'Asia/Bangkok'});
      console.log(formattedCreatedAt);

      if(post && post.published){
        post.view_count = (post.view_count || 0) + 1;
        console.log("View Count ", post.view_count)
        await this.postRepository.save(post);
      }
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
        created_at: formattedCreatedAt
      };
    }
    return post;
  }

  async update(id: string, updatePublicPostDto: UpdatePublicPostDto) {
    if (updatePublicPostDto.title === undefined && updatePublicPostDto.content === undefined && updatePublicPostDto.published === undefined) {
      return "content is not empty";
    }
    let post = await this.postRepository.findOne({where : { id }});

    if(!post){
      return null;
    }

    if(updatePublicPostDto.hasOwnProperty('published')){
      post.published = updatePublicPostDto.published;
    }

    console.log(post.published);
    Object.assign(post, updatePublicPostDto);

    const currentTime = new Date();
    post.updated_at = currentTime;

    if(post.created_at){
      const formattedCreatedAt = format(post.created_at,"yyyy-MM-dd 'T' HH:mm:ss", {timeZone: 'Asia/Bangkok'});
      const formattedUpdateddAt = format(currentTime,"yyyy-MM-dd 'T' HH:mm:ss", {timeZone: 'Asia/Bangkok'});
      
      if(post.view_count > 0){
        console.log("Before count", post.view_count - 1);
        console.log("After count ",post.view_count - 1);
        await this.postRepository.save(post);
        console.log(`Update : ${formattedUpdateddAt}`);
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: formattedCreatedAt,
        };
      }else{
        console.log("Before count", post.view_count);
        console.log("After count", post.view_count);
        await this.postRepository.save(post);
        console.log(`Update : ${formattedUpdateddAt}`);
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: formattedCreatedAt,
        };
      }
    }

    await this.postRepository.save(post);

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      created_at: post.created_at
    }

  }

  async remove(deletePublicPostDto: DeletePublicPostDto) {
    const toDelete = await this.postRepository.delete(deletePublicPostDto);
    return toDelete;
  }
}
