import { Platform, Traque as TraqueCore, type Event } from '@traque/core';
import type { Config, Exception, HttpRequestMethod } from '@traque/core';
import type { ResponseLike, RequestLike, NextFunctionLike } from './types';
import { getClientIp } from '@traque/utils';

export class Traque {
  private core: TraqueCore;
  private autoCaptureEnabled: boolean = false;

  constructor(config: Config) {
    this.core = new TraqueCore(config);
  }

  private extractHttpContext(
    req?: RequestLike,
    res?: ResponseLike,
  ): Exception['httpContext'] {
    if (!req) return undefined;

    return {
      url: req?.url,
      method: req?.method as HttpRequestMethod,
      statusCode: res?.statusCode,
      status: res?.statusMessage,
      clientIp: getClientIp(req),
    };
  }

  public captureException(
    exception: Error | Exception,
    req?: RequestLike,
    res?: ResponseLike,
  ): void {
    const traqueException = this.core.mapToTraqueException(exception);
    traqueException.platform = Platform.NODE_JS;
    traqueException.httpContext = this.extractHttpContext(req, res);

    this.core.captureException(traqueException);
  }

  public captureEvent(
    event: Event['name'],
    properties?: Event['properties'],
  ): void {
    this.core.captureEvent(event, properties);
  }

  public enableAutoCapture(): void {
    if (this.autoCaptureEnabled) return;

    process.on('uncaughtException', (error: Error) => {
      this.captureException(error);
    });

    process.on('unhandledRejection', (reason: unknown) => {
      const error =
        reason instanceof Error ? reason : new Error(String(reason));
      this.captureException(error);
    });

    this.autoCaptureEnabled = true;
  }

  public disableAutoCapture(): void {
    if (!this.autoCaptureEnabled) return;

    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.autoCaptureEnabled = false;
  }

  errorHandler = (
    error: Error,
    req: RequestLike,
    res: ResponseLike,
    next: NextFunctionLike,
  ) => {
    this.captureException(error, req, res);

    next(error);
  };
}
