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
import { ServicesService } from "./services.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getAllServices() {
    return this.servicesService.findAll();
  }

  @Get(":slug")
  async getServiceBySlug(@Param("slug") slug: string) {
    return this.servicesService.findOneBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateService(
    @Param("id") id: string,
    @Body() dto: Partial<CreateServiceDto>,
  ) {
    return this.servicesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteService(@Param("id") id: string) {
    return this.servicesService.remove(id);
  }
}
