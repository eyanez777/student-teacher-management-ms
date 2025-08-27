import { Controller, Get } from "@nestjs/common";
import { HealthcheckService } from "./healthcheck.service";


@Controller('healthcheck')
export class HealthcheckController {
  constructor(private readonly healthcheckService: HealthcheckService) {}

  @Get()
  async check(): Promise<string> {
    const rest = await this.healthcheckService.check();
     return `Service is ${rest.status}. Database is ${rest.db}`;
  }
}