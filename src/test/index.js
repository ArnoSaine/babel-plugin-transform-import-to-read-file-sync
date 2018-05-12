import { strictEqual } from 'assert';
import { transform } from '@babel/core';
import {
  importFile,
  importFooFile,
  importReadFileSync,
  transformToCodeWithOptions
} from './utils';

import './require';
import './encoding';
import './illegalUsage';
import './fsPreImported';
import './#1-multiple-imports-with-modules-transform';

strictEqual(
  transform(importFile).code,
  importFile,
  'Do nothing without plugin.'
);
strictEqual(
  transformToCodeWithOptions(importFile, { plugins: ['module:.'] }),
  importFile,
  'Do nothing without plugin options.'
);
strictEqual(
  transformToCodeWithOptions(importFile, {
    plugins: [
      [
        'module:.',
        {
          test: ''
        }
      ]
    ]
  }),
  importFile,
  'Do nothing with empty string test option.'
);

strictEqual(
  transformToCodeWithOptions(`${importFile}${importFooFile}`),
  `${importReadFileSync}

const file = _readFileSync(require.resolve("./file.txt"));

${importFooFile}`,
  'Do nothing to other files.'
);

console.log('Success');
