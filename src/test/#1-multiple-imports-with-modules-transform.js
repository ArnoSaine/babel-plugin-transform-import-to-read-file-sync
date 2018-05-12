import { strictEqual } from 'assert';
import { transformToCodeWithOptions } from './utils';

strictEqual(
  transformToCodeWithOptions(
    `import file1 from './file1.txt';
import file2 from './file2.txt';
import file3 from './file3.txt';`,
    {
      presets: ['@babel/preset-env'],
      plugins: [
        [
          'module:.',
          {
            test: '\\.txt$'
          }
        ]
      ]
    }
  ),
  `"use strict";

var _fs = require("fs");

var file1 = (0, _fs.readFileSync)(require.resolve("./file1.txt"));
var file2 = (0, _fs.readFileSync)(require.resolve("./file2.txt"));
var file3 = (0, _fs.readFileSync)(require.resolve("./file3.txt"));`,
  '#1 multiple imports.'
);

console.log(__filename);
