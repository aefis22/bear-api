import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  permissions: string[];
}
