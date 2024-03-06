import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  permissions: string[];
}
