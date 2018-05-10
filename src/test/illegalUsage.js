import { throws } from 'assert';
import { transformToCodeWithOptions } from './utils';

throws(
  () => transformToCodeWithOptions("import './file.txt';"),
  'No import declarations.'
);

throws(
  () => transformToCodeWithOptions("import {file} from './file.txt';"),
  'No default import.'
);

throws(
  () =>
    transformToCodeWithOptions("import file {namedImport} from './file.txt';"),
  'Only default import is allowed.'
);

console.log(__filename);
