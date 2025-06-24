import { IsNotEmpty, IsString } from "class-validator";

export class InviteMemberDTO {
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
