import * as Types from './types';

export class Resolver implements Types.IResolver {
  public async resolve(source: any, opts?: Types.IResolveOptions): Promise<Types.IResolveResult> {
    if (opts) {
      console.log(opts);
    }

    return source;
  }
}
