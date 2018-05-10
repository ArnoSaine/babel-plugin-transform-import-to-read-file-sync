# babel-plugin-transform-import-to-read-file-sync

Use `import` to read any file contents to local variable in Node.js. Filename is resolved like regular `import` source.

## Installation

```sh
npm install babel-plugin-transform-import-to-read-file-sync
```

## Example

```js
import file from "./file.txt";
// => const file = _readFileSync(require.resolve('./file.txt', "utf8"));
// readFileSync is imported from 'fs' as some unique identifier, if not already available.

console.log(require("./file.txt"));
// => console.log(require('fs').readFileSync(require.resolve('./file.txt', "utf8")));
```

##### `.babelrc`

```json
{
  "plugins": [
    [
      "transform-import-to-read-file-sync",
      {
        "test": "\\.txt$",
        "options": "utf8"
      }
    ]
  ]
}
```

### Options

Plugin expects options object or array of objects. `test` property is pattern to match files. `options` property is passed directly to `readFileSync` as second argument. If no `options` is specified, then `readFileSync` returns a buffer.

You can use array to specify multiple test patterns and `readFileSync` options:

```json
{
  "plugins": [
    [
      "transform-import-to-read-file-sync",
      [
        {
          "test": "\\.txt$",
          "options": "utf8"
        },
        {
          "test": "\\.png$"
        }
      ]
    ]
  ]
}
```

## License

ISC
