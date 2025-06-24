import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProjectDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
