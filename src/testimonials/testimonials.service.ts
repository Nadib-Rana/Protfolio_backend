import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

export interface UpsertTestimonialDto {
  id?: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating?: number;
  quote: string;
  verified?: boolean;
}

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async bulkSave(items: UpsertTestimonialDto[]) {
    await this.prisma.testimonial.deleteMany({});
    if (!items || items.length === 0) return [];

    const created: any[] = [];
    for (const item of items) {
      const res = await this.prisma.testimonial.create({
        data: {
          name: item.name,
          role: item.role,
          company: item.company,
          avatarUrl: item.avatarUrl || "",
          rating: item.rating ?? 5,
          quote: item.quote,
          verified: item.verified !== false,
        },
      });
      created.push(res);
    }
    return created;
  }

  async delete(id: string) {
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
