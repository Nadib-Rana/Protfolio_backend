import { Module } from "@nestjs/common";
import { TechStackController } from "./tech-stack.controller";
import { TechStackService } from "./tech-stack.service";

@Module({
  controllers: [TechStackController],
  providers: [TechStackService],
  exports: [TechStackService],
})
export class TechStackModule {}
