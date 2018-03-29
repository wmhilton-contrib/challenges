export interface IResolver {
  resolve(source: any, opts?: IResolveOptions): Promise<IResolveResult>;
}

export interface IResolveOptions {
  jsonPointer: string
}

export interface IResolveResult {
  result: any;
  errors: IResolveError[];
}

export interface IResolveError {
  code: string;
  message: string;
}

export const ErrorCodes = {
  POINTER_MISSING: 'POINTER_MISSING',
  MALFORMED_POINTER: 'MALFORMED_POINTER'
}