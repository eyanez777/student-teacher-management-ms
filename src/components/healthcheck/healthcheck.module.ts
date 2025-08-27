
import { Module } from '@nestjs/common';
import { HealthcheckService } from './healthcheck.service';
import { HealthcheckController } from './healthcheck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([])],
	controllers: [HealthcheckController],
	providers: [HealthcheckService],
})
export class HealthcheckModule {}
