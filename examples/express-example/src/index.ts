import express, { type Request, type Response } from 'express';
import { Traque } from '@traque/node';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 9000;

const app = express();

const traque = new Traque({
  apiKey: process.env.TRAQUE_API_KEY as string,
  serviceUrl: process.env.TRAQUE_SERVICE_URL as string,
  environment: 'PRODUCTION',
});

traque.enableAutoCapture();

app.use(traque.errorHandler);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello Traque' });
});

app.get('/error', () => {
  throw new Error('This is an example error thrown from the /error endpoint');
});

app.get('/manual-capture', (req: Request, res: Response) => {
  const error = new Error('Manual capture example');
  traque.captureException(error);

  res.json({ message: 'Manual capture example' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
