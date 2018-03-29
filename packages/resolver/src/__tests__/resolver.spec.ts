import * as fs from 'fs';

import { Resolver } from '../resolver';
import * as Types from '../types';

const runFixtures = (factory: any) => {
  const dir = `${__dirname}/fixtures/schemas`;

  // all
  const files = fs.readdirSync(dir);

  // working on now
  // const files: string[] = ['ref-parent-same-name.json'];

  for (const file of files) {
    if (!file.startsWith('.') && file.includes('.')) {
      const filePath = `${dir}/${file}`;
      const testCase = require(filePath);
      if (testCase.input) {
        factory(testCase, file, filePath);
      }
    }
  }
};

const runFixture = (resolver: any, testCase: any, _file: any, filePath: any) => {
  return async () => {
    const resolved = await resolver.resolve(testCase.input);
    expect(resolved.result).toEqual(testCase.expected);
  };
};

describe('resolver', () => {
  describe('fixtures', () => {
    runFixtures((testCase: any, file: any, filePath: any) => {
      const resolver = new Resolver();
      test.skip(file, runFixture(resolver, testCase, file, filePath));
    });
  });

  describe('resolve', () => {
    test.skip('should support jsonPointers', async () => {
      const source = {
        hello: {
          $ref: '#/word',
        },
        word: 'world',
      };

      const resolver = new Resolver();
      const resolved = await resolver.resolve(source);
      expect(resolved.result.hello).toBe('world');
    });

    test.skip('should support not resolving pointers', async () => {
      const source = {
        hello: {
          $ref: '#/world',
        },
        word: 'world',
      };

      const resolver = new Resolver();
      const resolved = await resolver.resolve(source);
      expect(resolved.result).toEqual(source);
    });

    test.skip('should support chained jsonPointers + partial resolution', async () => {
      const source = {
        hello: {
          $ref: '#/word',
        },
        word: {
          $ref: '#/word2',
        },
        word2: 'world',
      };

      const resolver = new Resolver();
      const resolved = await resolver.resolve(source, {
        jsonPointer: '#/hello',
      });
      expect(resolved.result).toEqual('world');
    });
  });

  describe('circular handling', () => {
    test.skip('should handle indirect circular pointer refs', async () => {
      const source = {
        ref1: {
          $ref: '#/ref3',
        },
        ref2: {
          $ref: '#/ref1',
        },
        ref3: {
          $ref: '#/ref2',
        },
      };

      const resolver = new Resolver();
      const resolved = await resolver.resolve(source);

      // should resolve to same object in memory
      expect(resolved.result.ref2 === resolved.result.ref3).toBe(true);

      expect(resolved.result).toEqual({
        ref1: {
          $ref: '#/ref1',
        },
        ref2: {
          $ref: '#/ref1',
        },
        ref3: {
          $ref: '#/ref1',
        },
      });
    });
  });

  describe('error handling', () => {
    test.skip('should track missing pointers', async () => {
      const source = {
        foo: 'bar',
        inner: {
          $ref: '#/missing',
        },
      };

      const resolver = new Resolver();
      const result = await resolver.resolve(source);

      expect(result.errors[0]).toEqual({
        code: 'POINTER_MISSING',
        message: "'#/missing' does not exist",
      });
    });
  });
});
