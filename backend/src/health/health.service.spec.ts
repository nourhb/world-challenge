import { HealthService } from './health.service';

describe('HealthService', () => {
  it('reports ok when the database responds', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
      country: { count: jest.fn().mockResolvedValue(40) },
    };
    const service = new HealthService(prisma as never);
    const result = await service.getHealth();

    expect(result.status).toBe('ok');
    expect(result.database).toBe('connected');
    expect(result.countriesSeeded).toBe(40);
  });

  it('reports degraded when the database is unavailable', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error('ECONNREFUSED')),
      country: { count: jest.fn() },
    };
    const service = new HealthService(prisma as never);
    const result = await service.getHealth();

    expect(result.status).toBe('degraded');
    expect(result.database).toBe('disconnected');
    expect(result.countriesSeeded).toBe(0);
  });
});
