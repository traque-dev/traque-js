import { Traque } from '@traque/nest';
import { Logger } from '@nestjs/common';

export const traque = new Traque({
  apiKey: process.env.TRAQUE_API_KEY as string,
  serviceUrl: process.env.TRAQUE_SERVICE_URL as string,
  environment: 'PRODUCTION',
  logger: new Logger('Traque'),
});
