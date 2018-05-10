import { strictEqual } from 'assert';
import {
  importFile,
  importReadFileSync,
  transformToCodeWithOptions
} from './utils';

strictEqual(
  transformToCodeWithOptions(`import 'fs';${importFile}`),
  `import 'fs';${importReadFileSync}

const file = _readFileSync(require.resolve('./file.txt'));`,
  "import 'fs'; does nothing."
);

const fsPreImported = (prependCode, expected) =>
  strictEqual(
    transformToCodeWithOptions(`${prependCode}${importFile}`),
    `${prependCode}const file = ${expected}(require.resolve('./file.txt'));`,
    `Prepending code: ${prependCode}`
  );

fsPreImported("import * as fileSystem from 'fs';", 'fileSystem.readFileSync');

fsPreImported("import fileSystem from 'fs';", 'fileSystem.readFileSync');

fsPreImported("import { readFileSync } from 'fs';", 'readFileSync');

fsPreImported("import { readFileSync as rf } from 'fs';", 'rf');

console.log(__filename);
