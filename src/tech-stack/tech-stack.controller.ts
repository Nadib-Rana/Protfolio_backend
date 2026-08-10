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
import { TechStackService } from "./tech-stack.service";
import { CreateTechCategoryDto } from "./dto/create-tech-category.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("tech-stack")
export class TechStackController {
  constructor(private readonly techStackService: TechStackService) {}

  @Get()
  async getAllCategories() {
    return this.techStackService.findAll();
  }

  @Get(":id")
  async getCategoryById(@Param("id") id: string) {
    return this.techStackService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createCategory(@Body() dto: CreateTechCategoryDto) {
    return this.techStackService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateCategory(
    @Param("id") id: string,
    @Body() dto: Partial<CreateTechCategoryDto>,
  ) {
    return this.techStackService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteCategory(@Param("id") id: string) {
    return this.techStackService.remove(id);
  }
}
