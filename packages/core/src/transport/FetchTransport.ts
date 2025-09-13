import { Transport } from './Transport';
import type { Exception, Event } from '../types';
import { buildUrl } from '@traque/utils';

export class FetchTransport extends Transport {
  private readonly captureExceptionUrl: string;
  private readonly captureEventUrl: string;

  constructor(serviceUrl: string, publicApiKey: string) {
    super(serviceUrl, publicApiKey);

    this.captureExceptionUrl = buildUrl(serviceUrl, '/api/v1/exceptions');
    this.captureEventUrl = buildUrl(serviceUrl, '/api/v1/events');
  }

  override sendException = (exception: Exception): void => {
    if (typeof fetch === 'undefined') {
      console.error('Fetch not available in this environment');
      return;
    }

    try {
      fetch(this.captureExceptionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.publicApiKey,
        },
        body: JSON.stringify(exception),
        keepalive: true,
      }).catch((error: unknown) => {
        console.error('Failed to send event:', error);
      });
    } catch (error: unknown) {
      console.error('Error sending event:', error);
    }
  };

  override sendEvent = (event: Event): void => {
    if (typeof fetch === 'undefined') {
      console.error('Fetch not available in this environment');
      return;
    }

    try {
      fetch(this.captureEventUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.publicApiKey,
        },
        body: JSON.stringify(event),
        keepalive: true,
      }).catch((error: unknown) => {
        console.error('Failed to send event:', error);
      });
    } catch (error: unknown) {
      console.error('Error sending event:', error);
    }
  };
}
