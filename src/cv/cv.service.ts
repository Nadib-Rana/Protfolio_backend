import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UpdateCVDto } from "./dto/update-cv.dto";

@Injectable()
export class CVService {
  constructor(private readonly prisma: PrismaService) {}

  async getCV() {
    const cv = await this.prisma.curriculumVitae.findFirst();
    if (!cv) {
      return {
        personalJson: {},
        educationJson: [],
        experienceJson: [],
        skillsJson: [],
        customSectionsJson: [],
        sectionOrderJson: [],
      };
    }
    return cv;
  }

  async updateCV(dto: UpdateCVDto) {
    const existing = await this.prisma.curriculumVitae.findFirst();

    if (existing) {
      return this.prisma.curriculumVitae.update({
        where: { id: existing.id },
        data: dto,
      });
    }

    return this.prisma.curriculumVitae.create({
      data: {
        personalJson: dto.personalJson || {},
        educationJson: dto.educationJson || [],
        experienceJson: dto.experienceJson || [],
        skillsJson: dto.skillsJson || [],
        customSectionsJson: dto.customSectionsJson || [],
        sectionOrderJson: dto.sectionOrderJson || [],
      },
    });
  }
}
