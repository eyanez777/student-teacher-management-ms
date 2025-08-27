import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckController } from '../src/components/healthcheck/healthcheck.controller';
import { HealthcheckService } from '../src/components/healthcheck/healthcheck.service';

describe('HealthcheckController', () => {
  let controller: HealthcheckController;
  let service: HealthcheckService;

  beforeEach(async () => {
    const serviceMock = { check: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckController],
      providers: [
        { provide: HealthcheckService, useValue: serviceMock },
      ],
    }).compile();
    controller = module.get<HealthcheckController>(HealthcheckController);
    service = module.get<HealthcheckService>(HealthcheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return healthcheck status from service', async () => {
    const status = { status: 'ok', db: 'online' };
    jest.spyOn(service, 'check').mockResolvedValue(status);
    const result = await controller.check();
    console.log('result', result);
    expect(result).toEqual(`Service is ${status.status}. Database is ${status.db}`);
  });
});
