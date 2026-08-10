import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateServiceDto } from "./dto/create-service.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async findAll() {
    return this.prisma.serviceOffering.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneBySlug(slug: string) {
    const item = await this.prisma.serviceOffering.findUnique({
      where: { slug },
    });
    if (!item) throw new NotFoundException(`Service '${slug}' not found`);
    return item;
  }

  async create(dto: CreateServiceDto) {
    const slug = this.slugify(dto.title);
    return this.prisma.serviceOffering.create({
      data: {
        ...dto,
        slug,
        deliverables: dto.deliverables || [],
      },
    });
  }

  async update(id: string, dto: Partial<CreateServiceDto>) {
    const existing = await this.prisma.serviceOffering.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException("Service not found");

    const data: any = { ...dto };
    if (dto.title && dto.title !== existing.title) {
      data.slug = this.slugify(dto.title);
    }

    return this.prisma.serviceOffering.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const item = await this.prisma.serviceOffering.findUnique({ where: { id } });
    if (!item) throw new NotFoundException("Service not found");

    return this.prisma.serviceOffering.delete({ where: { id } });
  }
}
