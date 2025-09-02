import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { v4 as uuidv4 } from 'uuid';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../components/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // No devolver password
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    // Establecer expiresIn manualmente o usar un valor de configuración
    const expiresIn = '7m';
    const access_token = await this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });
    return {
      access_token,
      expires_in: expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    // Buscar usuario por email o phone
    let user;
    if (body.email) {
      user = await this.usersService.findByEmail(body.email);
    } else if (body.phone) {
      user = await this.usersService.findByPhone(body.phone);
    }
   
    // Generar token único y expiración (ej: 15 minutos)
    const token = uuidv4();
    const expires = Date.now() + 15 * 60 * 1000;
    await this.usersService.setResetToken(user.id, token, expires);
    // Simulación: en desarrollo, mostrar el token; en prod, enviar por email/SMS
    if (process.env.NODE_ENV !== 'production') {
      return { message: 'Token de recuperación generado', token, expires };
    }
    // Aquí iría la lógica real de envío (email/SMS)
    return { message: 'Se ha enviado un enlace de recuperación' };
  }

  async resetPassword(body: ResetPasswordDto) {
    try {
      // Buscar usuario por token válido
      const user = await this.usersService.findByResetToken(body.token);
     
      if (!user) throw new BadRequestException('Usuario no encontrado');
      if (!user?.resetTokenExpires || user?.resetTokenExpires < Date.now()) {
        throw new BadRequestException('Token inválido o expirado');
      }
      // Cambiar contraseña y limpiar token
      await this.usersService.changePasswordByReset(user.id, body.newPassword);
      await this.usersService.clearResetToken(user.id);
      return { message: 'Contraseña restablecida correctamente' };
    } catch (error) {
      
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      const newToken = await this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        { expiresIn: '5m' },
      );
      return { access_token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
