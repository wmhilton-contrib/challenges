import * as Types from './types';
const get = require('get-value');
const got = require('got');

function isPointer(object: any) {
  return typeof object === 'object' && object.$ref;
}

export class Resolver implements Types.IResolver {
  public async resolve(source: any, opts?: Types.IResolveOptions): Promise<Types.IResolveResult> {
    if (opts) {
      console.log(opts);
    }
    // Sanitizing input to make sure it is valid JSON
    const result = JSON.parse(JSON.stringify(source));
    const errors = [];

    const pointers: any[] = [];

    function crawl(parent: Object) {
      let limit = 100;
      const unwalked = [parent];
      function walk(parent: any) {
        // For now lets assume the object (not array) case.
        for (const key of Object.keys(parent)) {
          const value = parent[key];
          if (isPointer(value)) {
            pointers.push({
              name: value.$ref,
              parent,
              key,
              target: null
            });
          } else if (typeof value === 'object') {
            unwalked.push(value);
          }
        }
      }
      while (unwalked.length && limit-- > 0) {
        walk(unwalked.shift());
      }
    }
    crawl(result);

    // Resolve pointer values (really we're just linking them, since we only
    // resolve to a depth of 1)
    const links = {};
    function linkPointer(pointer) {
      // Handle already resolved pointer paths by simply linking.
      // TODO: ignore relative link paths!
      if (links[pointer.name]) {
        pointer.target = links[pointer.name];
        return;
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
        });
        return;
      }
      pointer.target = get(source, pointer.name.replace('#/', ''), { seperator: '/' });
      if (pointer.target === undefined) {
        errors.push({
          code: Types.ErrorCodes.POINTER_MISSING,
          message: `'${pointer.name}' does not exist`
        });
      } else {
        // remember this value for resolving later
        links[pointer.name] = pointer.target;
      }
    }

    for (const pointer of pointers) {
      linkPointer(pointer);
    }

    // Assemble output object
    let limit = 10000;
    while (pointers.length && limit-- > 0) {
      const pointer = pointers.shift();
      if (pointer.target) {
        if (isPointer(pointer.target)) {
          // Handle pointers to pointers
          let stack = new Set();
          let limit = 100;
          // This stops as soon as a cycle is detected
          while (isPointer(pointer.target) && !stack.has(pointer.target) && limit--) {
            console.log(stack);
            stack.add(pointer.target);
            console.log(pointer.target);
            console.log(links);
            pointer.target = links[pointer.target.$ref];
          }
        } else if (typeof pointer.target === 'object') {
          crawl(pointer.target);
        }
        // target is now ready to replace pointer object
        pointer.parent[pointer.key] = pointer.target;
      }
    }

    return {
      result,
      errors
    };
  }
}
