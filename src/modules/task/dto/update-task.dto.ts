// src/modules/task/dto/update-task.dto.ts
import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../../generated/prisma"; // Pastikan import sesuai path

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
