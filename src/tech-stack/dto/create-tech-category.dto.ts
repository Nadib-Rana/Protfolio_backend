import { IsString, IsNotEmpty, IsOptional, IsInt } from "class-validator";

export class CreateTechCategoryDto {
  @IsString()
  @IsNotEmpty()
  iconKey: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  gradient: string;

  @IsOptional()
  tagsJson?: any;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
