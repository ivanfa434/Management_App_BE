import { IsNotEmpty, IsString } from "class-validator";

export class UpdateSampleDTO {
  @IsNotEmpty()
  @IsString()
  readonly name?: string;
}
