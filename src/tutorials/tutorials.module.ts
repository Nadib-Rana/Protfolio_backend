import { Module } from "@nestjs/common";
import { TutorialsController } from "./tutorials.controller";
import { TutorialsService } from "./tutorials.service";

@Module({
  controllers: [TutorialsController],
  providers: [TutorialsService],
  exports: [TutorialsService],
})
export class TutorialsModule {}
