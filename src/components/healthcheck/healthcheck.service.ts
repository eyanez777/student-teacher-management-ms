import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthcheckService {
  constructor(private readonly dataSource: DataSource) {}

  async isDatabaseHealthy(): Promise<boolean> {
    try {
      const res = JSON.stringify(await this.dataSource.query('SELECT 1'));
      console.log('res query datasource ', res);
      return true;
    } catch (error) {
      return false;
    }
  }

  async check(): Promise<{ status: string; db: string }> {
    const dbStatus = await this.isDatabaseHealthy();
    return {
      status: dbStatus ? 'ok' : 'error',
      db: dbStatus ? 'online' : 'offline',
    };
  }
}
