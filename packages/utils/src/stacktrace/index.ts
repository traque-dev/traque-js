import type { StackFrame, Stacktrace } from './types';

const V8_STACK_LINE =
  /^\s*at (?:(?<fn>[^\(]+?)\s+)?\(?(?<path>.*?):(?<line>\d+):(?<col>\d+)\)?$/;
const FF_SAFARI_STACK_LINE =
  /^(?:(?<fn>.*?)@)?(?<path>.*?):(?<line>\d+):(?<col>\d+)$/;

function isInternalOrExternal(
  framePath: string,
  functionName?: string,
): boolean {
  if (!framePath) return true;
  if (functionName && functionName.trim() === 'native') return true;
  const p = framePath.trim();
  return (
    p.startsWith('node:') ||
    p.includes('node:internal') ||
    p.includes('internal/') ||
    p.includes('node_modules/') ||
    p.includes('/node_modules/') ||
    p.includes('webpack-internal:') ||
    p === 'native'
  );
}

function extractModule(framePath: string): string | undefined {
  const nmIndex = framePath.lastIndexOf('node_modules/');
  if (nmIndex >= 0) {
    const after = framePath.slice(nmIndex + 'node_modules/'.length);
    const parts = after.split('/');
    if (parts[0]) {
      if (parts[0].startsWith('@') && parts.length >= 2) {
        return `${parts[0]}/${parts[1]}`;
      }
      return parts[0];
    }
  }
  return undefined;
}

function basename(path: string): string | undefined {
  if (!path) return undefined;
  try {
    const hashIndex = path.indexOf('#');
    const clean = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
    const queryIndex = clean.indexOf('?');
    const noQuery = queryIndex >= 0 ? clean.slice(0, queryIndex) : clean;
    const idx = Math.max(noQuery.lastIndexOf('/'), noQuery.lastIndexOf('\\'));
    return idx >= 0 ? noQuery.slice(idx + 1) : noQuery;
  } catch {
    return path;
  }
}

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function normalizePath(input: string): string {
  if (!input) return input;
  return input
    .replace(/^\((.*)\)$/, '$1')
    .replace(/^webpack-internal:\/\//, '')
    .replace(/^file:\/\//, '')
    .trim();
}

function parseLine(line: string): StackFrame | undefined {
  const trimmed = line.trim();
  if (!trimmed || trimmed.toLowerCase().startsWith('error')) return undefined;

  let match = V8_STACK_LINE.exec(trimmed);
  if (!match) {
    match = FF_SAFARI_STACK_LINE.exec(trimmed);
  }

  if (match && match.groups) {
    const rawPath = normalizePath(match.groups['path'] || '');
    const functionName = (match.groups['fn'] || '').trim() || undefined;
    const lineNumber = toNumber(match.groups['line']);
    const columnNumber = toNumber(match.groups['col']);
    const filename = basename(rawPath);

    const frame: StackFrame = {
      filename,
      functionName,
      lineNumber,
      columnNumber,
      absolutePath: rawPath || undefined,
      module: extractModule(rawPath || ''),
      inApp: !isInternalOrExternal(rawPath || '', functionName),
    };
    return frame;
  }

  return undefined;
}

export function parseStacktrace(stack: string): Stacktrace {
  const frames: StackFrame[] = [];
  if (!stack) {
    return { frames };
  }

  const lines = stack.split('\n');
  for (const line of lines) {
    const frame = parseLine(line);
    if (frame) {
      frames.push(frame);
    }
  }

  if (frames.length > 1) {
    frames.reverse();
  }

  return { frames };
}

export type { StackFrame, Stacktrace };
