import { IsOptional } from "class-validator";

export class UpdateCVDto {
  @IsOptional()
  personalJson?: any;

  @IsOptional()
  educationJson?: any;

  @IsOptional()
  experienceJson?: any;

  @IsOptional()
  skillsJson?: any;

  @IsOptional()
  customSectionsJson?: any;

  @IsOptional()
  sectionOrderJson?: any;
}
