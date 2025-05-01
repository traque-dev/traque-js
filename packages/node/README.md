# Traque Node.js SDK

## Installation

```bash
npm install @traque/node

yarn install @traque/node

pnpm install @traque/node
```

## Quick Start

```typescript
import { Traque } from '@traque/node';

// Initialize the SDK
const traque = new Traque({
  serviceUrl: 'YOUR_TRAQUE_SERVICE_URL',
  apiKey: 'YOUR_API_KEY',
  environment: 'PRODUCTION',
});

// Enable automatic error capturing
traque.enableAutoCapture();
```

## Features

### Manual Error Capturing

Capture errors manually with additional context:

```typescript
try {
  // Your code here
} catch (error) {
  traque.captureException(error);
}
```

### HTTP Context Tracking

The SDK automatically captures HTTP context when provided with request and response objects. This works with any Node.js web framework:

#### Express.js

```typescript
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  traque.captureException(err, req, res);
  next(err);
});
```

#### Fastify

```typescript
fastify.setErrorHandler((error, request, reply) => {
  traque.captureException(error, request.raw, reply.raw);
  throw error;
});
```

#### Hono

```typescript
app.onError((err, c) => {
  traque.captureException(err, c.req.raw, c.res.raw);
  return c.text('Internal Server Error', 500);
});
```

The captured HTTP context includes:

- Request URL
- HTTP method
- Status code
- Status message
- Client IP address

### Automatic Error Capturing

Enable automatic capturing of unhandled exceptions and rejections:

```typescript
// Enable automatic capturing
traque.enableAutoCapture();

// Disable automatic capturing when needed
traque.disableAutoCapture();
```

## API Reference

### `new Traque(config: Config): Traque`

Create a new Traque instance with configuration.

```typescript
interface Config {
  serviceUrl: string; // Your Traque service URL
  apiKey: string; // Your API key
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  plugins?: Plugin[]; // Optional plugins
}
```

### `captureException(exception: Error | Exception, req?: RequestLike, res?: ResponseLike): void`

Manually capture an exception with optional HTTP context.

### `enableAutoCapture(): void`

Enable automatic capturing of unhandled exceptions and rejections.

### `disableAutoCapture(): void`

Disable automatic error capturing.

## Best Practices

1. Create a single Traque instance and reuse it throughout your application
2. Use automatic capturing for production environments
3. Add HTTP context to your error reports when available
4. Consider using plugins for additional functionality

## Error Handling

The SDK includes robust error handling:

- Validates configuration on initialization
- Handles network errors gracefully
- Provides clear error messages for common issues
- Supports both synchronous and asynchronous error capturing
- Automatically captures HTTP context when available

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

MIT
