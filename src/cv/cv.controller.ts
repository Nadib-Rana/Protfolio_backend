import { Controller, Get, Put, Body, UseGuards } from "@nestjs/common";
import { CVService } from "./cv.service";
import { UpdateCVDto } from "./dto/update-cv.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("cv")
export class CVController {
  constructor(private readonly cvService: CVService) {}

  @Get()
  async getCVData() {
    return this.cvService.getCV();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateCVData(@Body() dto: UpdateCVDto) {
    return this.cvService.updateCV(dto);
  }
}
