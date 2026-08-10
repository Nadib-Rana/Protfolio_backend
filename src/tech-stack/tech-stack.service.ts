import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateTechCategoryDto } from "./dto/create-tech-category.dto";

@Injectable()
export class TechStackService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.techStackCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.techStackCategory.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException(`Tech stack category not found`);
    return item;
  }

  async create(dto: CreateTechCategoryDto) {
    return this.prisma.techStackCategory.create({
      data: {
        ...dto,
        tagsJson: dto.tagsJson || [],
      },
    });
  }

  async update(id: string, dto: Partial<CreateTechCategoryDto>) {
    await this.findOne(id);
    return this.prisma.techStackCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.techStackCategory.delete({ where: { id } });
  }
}
