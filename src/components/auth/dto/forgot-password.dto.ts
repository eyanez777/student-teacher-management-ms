import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class ForgotPasswordDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber('MX') // Cambia 'MX' por tu país si es necesario
  phone?: string;
}
