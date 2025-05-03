import type { Exception } from '@traque/core';

export function errorToException(error: Error): Exception {
  return {
    name: error.name,
    message: error.message,
  };
}
