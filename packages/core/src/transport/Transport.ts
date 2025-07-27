import type { Exception, Event } from '../types';

export class Transport {
  protected readonly serviceUrl: string;
  protected readonly publicApiKey: string;

  constructor(serviceUrl: string, publicApiKey: string) {
    this.serviceUrl = serviceUrl;
    this.publicApiKey = publicApiKey;
  }

  sendException(exception: Exception) {
    throw new Error('Transport method is not implemented');
  }

  sendEvent(event: Event) {
    throw new Error('Transport method is not implemented');
  }
}
