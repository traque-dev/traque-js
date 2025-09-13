export type StackFrame = {
  filename?: string;
  functionName?: string;
  lineNumber?: number;
  columnNumber?: number;
  absolutePath?: string;
  module?: string;
  inApp?: boolean;
  platform?: string;
};

export type Stacktrace = {
  frames: StackFrame[];
};
