import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule, UsersModule, CoursesModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
