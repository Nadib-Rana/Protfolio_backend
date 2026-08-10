import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateBlogPostDto } from "./dto/create-blog-post.dto";
import { UpdateBlogPostDto } from "./dto/update-blog-post.dto";

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async findAll() {
    return this.prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Article '${slug}' not found`);
    return post;
  }

  async create(dto: CreateBlogPostDto) {
    const slug = this.slugify(dto.title);

    if (dto.featured) {
      await this.prisma.blogPost.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        intro: dto.intro || "",
        conclusion: dto.conclusion || "",
        highlights: dto.highlights || [],
        tags: dto.tags || [],
      },
    });
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Article not found");

    if (dto.featured) {
      await this.prisma.blogPost.updateMany({
        where: { featured: true },
        data: { featured: false },
      });
    }

    const data: any = { ...dto };
    if (dto.title && dto.title !== existing.title) {
      data.slug = this.slugify(dto.title);
    }

    return this.prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("Article not found");

    return this.prisma.blogPost.delete({ where: { id } });
  }
}
