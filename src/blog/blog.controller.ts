import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async getAllPosts() {
    return this.blogService.findAll();
  }

  @Get(":slug")
  async getPostBySlug(@Param("slug") slug: string) {
    return this.blogService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updatePost(
    @Param("id") id: string,
    @Body() dto: UpdateBlogPostDto,
  ) {
    return this.blogService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deletePost(@Param("id") id: string) {
    return this.blogService.remove(id);
  }
}
