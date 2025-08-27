import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { UsersModule } from './components/users/users.module';
import { CoursesModule } from './components/courses/courses.module';

import { AuthModule } from './components/auth/auth.module';
import { HealthcheckModule } from './components/healthcheck/healthcheck.module';

@Module({
  imports: [ConfigModule, UsersModule, CoursesModule, AuthModule, HealthcheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
