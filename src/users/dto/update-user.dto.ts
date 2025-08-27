import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../entity/user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Juan Perez' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'juan@test.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Password123' })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, example: 'alumno' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
