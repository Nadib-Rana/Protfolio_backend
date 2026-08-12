import { Controller, Get, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { TestimonialsService, UpsertTestimonialDto } from "./testimonials.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async bulkSave(@Body() items: UpsertTestimonialDto[]) {
    return this.service.bulkSave(items);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
