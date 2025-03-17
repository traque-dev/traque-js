import { Traque as TraqueCore } from '@traque/core';
import type { TraqueNestConfig } from './types';
import { type INestApplication, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { TraqueExceptionFilter } from './filters/TraqueException.filter';

export class Traque extends TraqueCore {
  public readonly app?: INestApplication;
  public readonly logger?: Logger;

  constructor(config: TraqueNestConfig) {
    super(config);

    this.logger = config.logger;
    this.app = config.app;
  }

  setupNestExceptionFilter(app: INestApplication) {
    const httpAdapter = app.get(HttpAdapterHost);

    app.useGlobalFilters(new TraqueExceptionFilter(httpAdapter, this));

    return this;
  }
}
