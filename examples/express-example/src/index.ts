import express, {
  type Request,
  type Response,
  type NextFunction,
  type ErrorRequestHandler,
} from 'express';
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

const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  traque.captureException(error, req, res);

  res.status(500).json({
    statusCode: 500,
    message: error.message,
    error: 'Internal Server Error',
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
