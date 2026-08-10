import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new NotFoundException(`Project '${slug}' not found`);
    return project;
  }

  async create(dto: CreateProjectDto) {
    const slug = this.slugify(dto.title);
    return this.prisma.project.create({
      data: {
        ...dto,
        slug,
        modules: dto.modules || [],
        features: dto.features || [],
        tags: dto.tags || [],
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Project not found");

    const data: any = { ...dto };
    if (dto.title && dto.title !== existing.title) {
      data.slug = this.slugify(dto.title);
    }

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOneBySlug(id).catch(async () => {
      const p = await this.prisma.project.findUnique({ where: { id } });
      if (!p) throw new NotFoundException("Project not found");
      return p;
    });

    return this.prisma.project.delete({ where: { id } });
  }
}
