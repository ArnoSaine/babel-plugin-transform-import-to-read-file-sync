import { strictEqual } from 'assert';
import {
  importFile,
  importFooFile,
  importReadFileSync,
  transformToCodeWithOptions
} from './utils';

import './require';
import './illegalUsage';
import './fsPreImported';

strictEqual(
  transformToCodeWithOptions(importFile, {
    plugins: [
      [
        '.',
        {
          test: '\\.txt$',
          options: 'utf8'
        }
      ]
    ]
  }),
  `${importReadFileSync}

const file = _readFileSync(require.resolve('./file.txt'), "utf8");`,
  'Use encoding.'
);

strictEqual(
  transformToCodeWithOptions(`${importFile}${importFooFile}`, {
    plugins: [
      [
        '.',
        [
          {
            test: '\\.txt$',
            options: 'ascii'
          },
          {
            test: '\\.foo$',
            options: {
              encoding: 'base64',
              flag: 'r'
            }
          }
        ]
      ]
    ]
  }),
  `${importReadFileSync}

const file = _readFileSync(require.resolve('./file.txt'), "ascii");

const fooFile = _readFileSync(require.resolve('./file.foo'), {
  "encoding": "base64",
  "flag": "r"
});`,
  'Multiple extensions and encodings.'
);

console.log(__filename);
