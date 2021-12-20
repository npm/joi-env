import { CoerceFunction, RuleMethod } from 'joi';

declare module 'joi' {
  interface AnySchema {
    env(key: string): this;
  }
}

interface JoiEnvExtension {
  type: RegExp,
  prepare: CoerceFunction,
  rules: {
    env: {
      method: RuleMethod
    }
  },
}

declare const ext: JoiEnvExtension;
export = ext;
