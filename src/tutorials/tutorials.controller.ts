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
import { TutorialsService } from "./tutorials.service";
import { CreateTutorialDto } from "./dto/create-tutorial.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("tutorials")
export class TutorialsController {
  constructor(private readonly tutorialsService: TutorialsService) {}

  @Get()
  async getAllTutorials() {
    return this.tutorialsService.findAll();
  }

  @Get(":slug")
  async getTutorialBySlug(@Param("slug") slug: string) {
    return this.tutorialsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTutorial(@Body() dto: CreateTutorialDto) {
    return this.tutorialsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateTutorial(
    @Param("id") id: string,
    @Body() dto: Partial<CreateTutorialDto>,
  ) {
    return this.tutorialsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteTutorial(@Param("id") id: string) {
    return this.tutorialsService.remove(id);
  }
}
