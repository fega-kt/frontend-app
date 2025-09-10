/**
 * @publicApi
 */
export type HealthIndicatorStatus = 'up' | 'down';
/**
 * The result object of a health indicator
 * @publicApi
 */
export type HealthIndicatorResult<
  Key extends string = string,
  Status extends HealthIndicatorStatus = HealthIndicatorStatus,
  OptionalData extends Record<string, object> = Record<string, object>,
> = Record<
  Key,
  {
    status: Status;
  } & OptionalData
>;

/**
 * @publicApi
 */
export type HealthCheckStatus = 'error' | 'ok' | 'shutting_down';
/**
 * The result of a health check
 * @publicApi
 */
export interface HealthCheckResult {
  /**
   * The overall status of the Health Check
   */
  status: HealthCheckStatus;
  /**
   * The info object contains information of each health indicator
   * which is of status "up"
   */
  info?: HealthIndicatorResult;
  /**
   * The error object contains information of each health indicator
   * which is of status "down"
   */
  error?: HealthIndicatorResult;
  /**
   * The details object contains information of every health indicator.
   */
  details: HealthIndicatorResult;
}
