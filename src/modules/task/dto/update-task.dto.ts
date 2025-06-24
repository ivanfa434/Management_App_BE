import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../../generated/prisma";

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
