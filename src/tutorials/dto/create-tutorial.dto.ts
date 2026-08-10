import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
} from "class-validator";
import { TutorialLevel } from "@prisma/client";

export class CreateTutorialDto {
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
  duration: string;

  @IsEnum(TutorialLevel)
  @IsOptional()
  level?: TutorialLevel;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  highlights?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  topics?: string[];
}
