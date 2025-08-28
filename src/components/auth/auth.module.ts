import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../../components/users/users.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../utils/jwt.strategy';

@Module({
  imports: [UsersModule, JwtModule.register({ secret: 'jwt_secret', signOptions: { expiresIn: '30m' } })],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
