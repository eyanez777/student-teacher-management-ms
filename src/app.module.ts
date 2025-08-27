import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [ConfigModule, UsersModule, CoursesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
