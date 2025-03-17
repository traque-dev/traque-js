import type { Config } from '@traque/core';
import { type INestApplication, Logger } from '@nestjs/common';

export type TraqueNestConfig = Config & {
  app?: INestApplication;
  logger?: Logger;
};
