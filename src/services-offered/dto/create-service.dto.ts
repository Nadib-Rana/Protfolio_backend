import { IsString, IsNotEmpty, IsArray, IsOptional } from "class-validator";

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  iconLabel: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  deliverables?: string[];

  @IsString()
  @IsNotEmpty()
  bestFor: string;
}
