import { Platform, Traque as TraqueCore } from '@traque/core';
import type { Config, Exception, HttpRequestMethod } from '@traque/core';
import type { ResponseLike, RequestLike } from './types';
import { getClientIp } from '@traque/utils';

/**
 * Node.js SDK for Traque
 * Provides both manual and automatic error tracking capabilities
 */
export class Traque {
  private core: TraqueCore;
  private isInitialized: boolean = false;
  private autoCaptureEnabled: boolean = false;

  constructor(config: Config) {
    this.core = new TraqueCore(config);
    this.isInitialized = true;
  }

  /**
   * Extracts HTTP context from request and response objects
   * @param req HTTP request object
   * @param res HTTP response object
   * @returns HTTP context
   */
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

  /**
   * Maps a JavaScript Error to a Traque Exception
   * @param error JavaScript Error or Traque Exception
   * @param req Optional HTTP request object
   * @param res Optional HTTP response object
   * @returns Traque Exception
   */
  private mapToException(
    error: Error | Exception,
    req?: RequestLike,
    res?: ResponseLike,
  ): Exception {
    return {
      name: error instanceof Error ? error.name : error.name,
      message: error instanceof Error ? error.message : error.message,
      platform: Platform.NODE_JS,
      environment: this.core.getConfig().environment,
      httpContext: this.extractHttpContext(req, res),
    };
  }

  /**
   * Manually capture an exception
   * @param exception Exception object or Error instance
   * @param req Optional HTTP request object
   * @param res Optional HTTP response object
   */
  public captureException(
    exception: Error | Exception,
    req?: RequestLike,
    res?: ResponseLike,
  ): void {
    if (!this.isInitialized) {
      throw new Error(
        'Traque has not been initialized. Call Traque.init() first.',
      );
    }

    const exceptionData = this.mapToException(exception, req, res);
    this.core.captureException(exceptionData);
  }

  /**
   * Enable automatic error capturing
   * This will capture unhandled rejections and uncaught exceptions
   */
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

  /**
   * Disable automatic error capturing
   */
  public disableAutoCapture(): void {
    if (!this.autoCaptureEnabled) return;

    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');

    this.autoCaptureEnabled = false;
  }
}
