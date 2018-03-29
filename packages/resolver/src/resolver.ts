import * as Types from './types';
const get = require('get-value');

function iterateOver (object : Object | Array<any>, foreach : Function) {
  if (Array.isArray(object)) {
    for (const el of object) {
      foreach(el)
    }
  }
}

export class Resolver implements Types.IResolver {
  public async resolve(source: any, opts?: Types.IResolveOptions): Promise<Types.IResolveResult> {
    if (opts) {
      console.log(opts);
    }
    // Sanitizing input to make sure it is valid JSON
    const result = JSON.parse(JSON.stringify(source))
    const errors = [];

    const unwalked = [result];
    const pointers : any[] = [];

    function walk (parent : any) {
      // For now lets assume the object (not array) case.
      for (const key of Object.keys(parent)) {
        const value = source[key];
        if (typeof value === 'object') {
          if (value.$ref) {
            pointers.push({
              name: value.$ref,
              parent,
              key,
              target: null
            })
          } else {
            unwalked.push(value);
          }
        }
      }
    }

    let limit = 100;
    while (unwalked.length && limit-- > 0) {
      walk(unwalked.shift());
    }

    // Resolve pointer values
    for (const pointer of pointers) {
      if (pointer.name.startsWith('#/')) {
        pointer.target = get(source, pointer.name.replace('#/', ''), {seperator: '/'})
      } else {
        errors.push({
          code: Types.ErrorCodes.POINTER_MISSING,
          message: `'${pointer.name}' does not exist`
        })
      }
    }

    // Assemble output object
    for (const pointer of pointers) {
      if (pointer.target) {
        pointer.parent[pointer.key] = pointer.target;
      }
    }

    console.log(pointers);
    return {
      result,
      errors
    };
  }
}
