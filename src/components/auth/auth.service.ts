import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async refreshToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      const newToken = await this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      }, { expiresIn: '5m' });
      return { access_token: newToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
