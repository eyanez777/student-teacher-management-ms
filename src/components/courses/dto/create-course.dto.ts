
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Matemáticas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Curso de matemáticas básicas' })
  @IsString()
  @IsOptional()
  description?: string;
}
