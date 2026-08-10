import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from "class-validator";

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  publishedAt: string;

  @IsString()
  @IsNotEmpty()
  readTime: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  intro?: string;

  @IsString()
  @IsOptional()
  conclusion?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsOptional()
  sectionsJson?: any;
}
