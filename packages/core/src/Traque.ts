import type { Config, Exception, Event } from './types';
import { FetchTransport, Transport } from './transport';
import { parseStacktrace } from '@traque/utils';

export class Traque {
  private readonly config: Config;
  private transport: Transport;

  constructor(config: Config) {
    this.validateConfig(config);

    this.config = {
      sendStacktrace: true,
      sampleRate: {
        exceptions: 1,
        events: 1,
      },
      ...config,
    };

    this.transport = new FetchTransport(config.serviceUrl, config.apiKey);
  }

  validateConfig({ serviceUrl, apiKey, sampleRate }: Config) {
    if (!serviceUrl) {
      throw new Error('Please enter your service URL');
    }

    if (!apiKey) {
      throw new Error('Please enter your API key');
    }

    if (sampleRate?.exceptions) {
      if (sampleRate.exceptions < 0) {
        throw new Error('exceptionsSampleRate must be greater than 0');
      }

      if (sampleRate.exceptions > 1) {
        throw new Error('exceptionsSampleRate must be less than 1');
      }
    }

    if (sampleRate?.events) {
      if (sampleRate.events < 0) {
        throw new Error('eventsSampleRate must be greater than 0');
      }

      if (sampleRate.events > 1) {
        throw new Error('eventsSampleRate must be less than 1');
      }
    }
  }

  getConfig(): Config {
    if (!this.config) {
      throw new Error(
        'Traque has not been initialized. Call Traque.init() first.',
      );
    }

    return this.config;
  }

  private shouldSample(rate?: number): boolean {
    if (rate === undefined) return true;
    if (typeof rate !== 'number' || Number.isNaN(rate)) {
      console.warn(
        'Invalid exceptionsSampleRate: expected a number between 0 and 1',
      );
      return true;
    }
    if (rate <= 0) return false;
    if (rate >= 1) return true;
    return Math.random() < rate;
  }

  captureException(exception: Error | Exception) {
    if (!this.shouldSample(this.config.sampleRate?.exceptions)) {
      return;
    }

    const detailedException = this.mapToTraqueException(exception);

    return this.transport.sendException(detailedException);
  }

  captureEvent(name: Event['name'], properties?: Event['properties']) {
    if (!this.shouldSample(this.config.sampleRate?.events)) {
      return;
    }

    const event: Event = {
      name,
      properties,
    };

    return this.transport.sendEvent(event);
  }

  public mapToTraqueException(exception: Error | Exception): Exception {
    if (exception instanceof Error) {
      return {
        environment: this.config.environment,
        name: exception.name || 'Error',
        message: exception.message || String(exception),
        stack: this.config.sendStacktrace ? exception.stack : undefined,
        stacktrace:
          exception.stack && this.config.sendStacktrace
            ? parseStacktrace(exception.stack)
            : undefined,
      };
    }

    return {
      environment: this.config.environment,
      ...exception,
    };
  }
}
