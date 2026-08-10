import { Module } from "@nestjs/common";
import { CVController } from "./cv.controller";
import { CVService } from "./cv.service";

@Module({
  controllers: [CVController],
  providers: [CVService],
  exports: [CVService],
})
export class CVModule {}
