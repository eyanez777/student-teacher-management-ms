import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'one_api',
      password: '123456',
      database: 'one_rest_api',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ usar solo en desarrollo
    }),
  ],
})
export class ConfigModule {}
