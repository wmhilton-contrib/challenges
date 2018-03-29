import * as Types from './types';
const get = require('get-value');
const got = require('got');

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

    // Resolve pointer values (really we're just linking them, since we only
    // resolve to a depth of 1)
    const links = {};
    for (const pointer of pointers) {
      // Handle already resolved pointer paths by simply linking.
      // TODO: ignore relative link paths!
      if (links[pointer.name]) {
        pointer.target = links[pointer.name];
        continue;
      }
      // Handle URIs
      // if (pointer.name.startsWith('http')) {
      //   pointer.value = await got(pointer.name, {json: true});
      //   console.log(pointer.value);
      //   // TODO: handle errors
      //   links[pointer.name] = pointer.value;
      //   continue;
      // }
      // Handle document absolute paths.
      if (!pointer.name.startsWith('#/')) {
        errors.push({
          code: Types.ErrorCodes.POINTER_MISSING,
          message: `'${pointer.name}' does not exist`
        })
        continue;
      }
      pointer.target = get(source, pointer.name.replace('#/', ''), {seperator: '/'})
      if (pointer.target === undefined) {
        errors.push({
          code: Types.ErrorCodes.POINTER_MISSING,
          message: `'${pointer.name}' does not exist`
        })
      } else {
        // remember this value for resolving later
        links[pointer.name] = pointer.target;
      }
    }

    // Assemble output object
    limit = 10000;
    const references = pointers.slice(0);
    while (references.length && limit-- > 0) {
      const pointer = references.shift();
      if (pointer.target) {
        pointer.parent[pointer.key] = pointer.target;
        if (typeof pointer.target === 'object' && pointer.target.$ref) {
          // A pointer to a pointer! Add this to the list of references to resolve later.
          references.push({
            name: pointer.target.$ref,
            parent: pointer.parent,
            key: pointer.key,
            target: links[pointer.target.$ref]
          })
        }
      }
    }

    console.log(references);
    return {
      result,
      errors
    };
  }
}
