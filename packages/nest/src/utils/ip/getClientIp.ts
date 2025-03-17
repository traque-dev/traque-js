import { Request } from './Request';

/**
 * Retrieve the client IP address for the given `request`.
 *
 * @param {Object} request
 *
 * @returns {String}
 */
export function getClientIp(request: any): string | undefined {
  return new Request(request).getClientIp();
}
