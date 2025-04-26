import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { type Exception, Platform } from '@traque/core';
import { getClientIp } from '../utils/ip';
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
    const { environment, plugins = [] } = this.traque.getConfig();

    const traqueException: Exception = {
      environment,
      platform: Platform.NEST_JS,
      name: exception.name,
      message: exception.message,
    };

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

    this.traque?.logger?.error(
      `Handle exception: ${JSON.stringify(traqueException)}`,
    );

    for (const plugin of plugins) {
      plugin.handle(traqueException);
    }

    this.traque.captureException(traqueException);

    super.catch(exception, host);
  }
}
