export type StackFrame = {
  filename?: string;
  function?: string;
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
