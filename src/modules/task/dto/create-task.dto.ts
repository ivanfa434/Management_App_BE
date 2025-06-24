// src/modules/task/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;
}
