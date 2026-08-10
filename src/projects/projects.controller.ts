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
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getAllProjects() {
    return this.projectsService.findAll();
  }

  @Get(":slug")
  async getProjectBySlug(@Param("slug") slug: string) {
    return this.projectsService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateProject(
    @Param("id") id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteProject(@Param("id") id: string) {
    return this.projectsService.remove(id);
  }
}
