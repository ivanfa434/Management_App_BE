import { IsEmail, IsNotEmpty } from "class-validator";

export class InviteMemberDTO {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
