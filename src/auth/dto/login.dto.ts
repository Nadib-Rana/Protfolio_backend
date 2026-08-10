import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class LoginDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
