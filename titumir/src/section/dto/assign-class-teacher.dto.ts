import { IsDefined, IsNotEmpty, IsUUID } from "class-validator";

export default class AssignClassTeacherDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  user_id!: string;
}