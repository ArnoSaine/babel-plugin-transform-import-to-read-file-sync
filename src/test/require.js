import { strictEqual } from 'assert';
import { transformToCodeWithOptions } from './utils';

strictEqual(
  transformToCodeWithOptions('var file = require("./file.txt");'),
  'var file = require("fs").readFileSync(require.resolve("./file.txt"));',
  'Require file.'
);

console.log(__filename);
