import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateTutorialDto } from "./dto/create-tutorial.dto";

@Injectable()
export class TutorialsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async findAll() {
    return this.prisma.tutorialVideo.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneBySlug(slug: string) {
    const item = await this.prisma.tutorialVideo.findUnique({
      where: { slug },
    });
    if (!item) throw new NotFoundException(`Tutorial '${slug}' not found`);
    return item;
  }

  async create(dto: CreateTutorialDto) {
    const slug = this.slugify(dto.title);
    return this.prisma.tutorialVideo.create({
      data: {
        ...dto,
        slug,
        highlights: dto.highlights || [],
        topics: dto.topics || [],
      },
    });
  }

  async update(id: string, dto: Partial<CreateTutorialDto>) {
    const existing = await this.prisma.tutorialVideo.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Tutorial not found");

    const data: any = { ...dto };
    if (dto.title && dto.title !== existing.title) {
      data.slug = this.slugify(dto.title);
    }

    return this.prisma.tutorialVideo.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const item = await this.prisma.tutorialVideo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Tutorial not found");

    return this.prisma.tutorialVideo.delete({ where: { id } });
  }
}
