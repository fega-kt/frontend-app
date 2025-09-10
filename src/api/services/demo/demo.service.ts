import { APIClient, PaginateResult } from '@/api/service-base';
import { DemoEntity } from './demo.entity';

export class DemoService extends APIClient<DemoEntity> {
  constructor() {
    super({
      endpoint: 'demo',
    });
  }

  get() {
    return this.getAll<PaginateResult<DemoEntity>>({
      endpoint: '',
    });
  }
}

export const demoService = new DemoService();
