import { transform } from 'babel-core';

export const importFile = "import file from './file.txt';";
export const importFooFile = "import fooFile from './file.foo';";
export const importReadFileSync =
  "import { readFileSync as _readFileSync } from 'fs';";

export const transformToCodeWithOptions = (
  code,
  options = {
    plugins: [
      [
        '.',
        {
          test: '\\.txt$'
        }
      ]
    ]
  }
) => transform(code, options).code;
