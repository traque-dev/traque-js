import type { Exception } from '../types';

export class Transport {
  protected readonly serviceUrl: string;
  protected readonly publicApiKey: string;

  constructor(serviceUrl: string, publicApiKey: string) {
    this.serviceUrl = serviceUrl;
    this.publicApiKey = publicApiKey;
  }

  send(event: Exception) {
    throw new Error('Transport method is not implemented');
  }
}
