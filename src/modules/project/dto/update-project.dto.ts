import { IsOptional, IsString } from "class-validator";

export class UpdateProjectDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
