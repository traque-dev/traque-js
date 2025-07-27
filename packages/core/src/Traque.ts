import type { Config, Exception, Event } from './types';
import { FetchTransport, Transport } from './transport';

export class Traque {
  private readonly config: Config;
  private transport: Transport;

  constructor(config: Config) {
    this.config = config;

    const { serviceUrl, apiKey } = config;

    if (!serviceUrl) {
      throw new Error('Please enter your service URL');
    }

    if (!apiKey) {
      throw new Error('Please enter your API key');
    }

    this.transport = new FetchTransport(serviceUrl, apiKey);
  }

  getConfig(): Config {
    if (!this.config) {
      throw new Error(
        'Traque has not been initialized. Call Traque.init() first.',
      );
    }

    return this.config;
  }

  captureException(exception: Exception) {
    const detailedException: Exception = {
      environment: this.config.environment,
      ...exception,
    };

    return this.transport.sendException(detailedException);
  }

  captureEvent(name: Event['name'], properties: Event['properties']) {
    const event: Event = {
      name,
      properties,
    };

    return this.transport.sendEvent(event);
  }
}
