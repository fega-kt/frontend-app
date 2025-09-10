import apiClient from '../../apiClient';

import { HealthCheckResult } from './health-checker';

export enum HealthApi {
  HealthDatabase = '/health/database',
}

const healthDatabase = () =>
  apiClient.get<HealthCheckResult[]>({ url: `${HealthApi.HealthDatabase}` });

export default {
  healthDatabase,
};
