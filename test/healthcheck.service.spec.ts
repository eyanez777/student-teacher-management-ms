import { HealthcheckService } from '../src/components/healthcheck/healthcheck.service';

describe('HealthcheckService', () => {
  let service: HealthcheckService;
  let dataSource: any;

  beforeEach(() => {
    dataSource = { query: jest.fn() };
    service = new HealthcheckService(dataSource);
  });

  it('should return true if DB is healthy', async () => {
    dataSource.query.mockResolvedValue([{}]);
    await expect(service.isDatabaseHealthy()).resolves.toBe(true);
  });

  it('should return false if DB is not healthy', async () => {
    dataSource.query.mockRejectedValue(new Error('fail'));
    await expect(service.isDatabaseHealthy()).resolves.toBe(false);
  });

  it('should return status ok if DB is healthy', async () => {
    jest.spyOn(service, 'isDatabaseHealthy').mockResolvedValue(true);
    const result = await service.check();
    expect(result).toEqual({ status: 'ok', db: 'online' });
  });

  it('should return status error if DB is not healthy', async () => {
    jest.spyOn(service, 'isDatabaseHealthy').mockResolvedValue(false);
    const result = await service.check();
    expect(result).toEqual({ status: 'error', db: 'offline' });
  });
});
