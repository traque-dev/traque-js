import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Platform, getClientIp } from '@traque/core';
import { Traque as TraqueNest } from '../sdk';

@Catch()
export class TraqueExceptionFilter extends BaseExceptionFilter {
  constructor(
    public override readonly httpAdapterHost: HttpAdapterHost,
    private readonly traque: TraqueNest,
  ) {
    super();
  }

  override async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const { plugins = [] } = this.traque.getConfig();

    const traqueException = this.traque.mapToTraqueException(exception);

    traqueException.platform = Platform.NEST_JS;

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const exceptionResponse = exception.getResponse();

      const statusCode = exception?.getStatus();
      const status = HttpStatus?.[statusCode];
      const clientIp = getClientIp(request);

      traqueException.httpContext = {
        status,
        statusCode,
        clientIp,
        method: request?.method,
        url: request?.url,
        response: exceptionResponse,
      };
    }

    this.traque?.logger?.warn(
      `Handle exception ${traqueException.name}: ${traqueException.message}`,
    );

    for (const plugin of plugins) {
      plugin.handle(traqueException);
    }

    this.traque.captureException(traqueException);

    super.catch(exception, host);
  }
}
