import { equal } from 'assert';
import template from 'babel-template';

const fromSourceString = code => template(`(${code})`)().expression;

export default ({
  types: {
    callExpression,
    identifier,
    importDeclaration,
    importSpecifier,
    memberExpression,
    stringLiteral,
    variableDeclaration,
    variableDeclarator,

    isImportDeclaration,
    isImportDefaultSpecifier,
    isImportNamespaceSpecifier,
    isImportSpecifier,
    isStringLiteral,

    assertImportDefaultSpecifier
  }
}) => {
  const readFileSyncCallExpressionArgs = (value, options) => {
    // [require.resolve(<file>)[, encoding|options]]
    const args = [
      callExpression(
        memberExpression(identifier('require'), identifier('resolve')),
        [stringLiteral(value)]
      )
    ];
    if (options) {
      // Second argument to readFileSync can be string or object
      args.push(fromSourceString(JSON.stringify(options)));
    }
    return args;
  };
  const testOptions = (opts, value, match) => {
    const { options = [], test } = opts;
    const optsArray = test ? [opts] : options;
    optsArray.some(({ options, test }) => {
      if (test && new RegExp(test).test(value)) {
        return match(readFileSyncCallExpressionArgs(value, options));
      }
    });
  };
  return {
    visitor: {
      ImportDeclaration(path, { opts }) {
        const {
          specifiers,
          source: { value }
        } = path.node;
        testOptions(opts, value, readFileSyncArgs => {
          equal(specifiers.length, 1, 'Number of import specifiers.');
          assertImportDefaultSpecifier(specifiers[0]);
          const { local } = specifiers[0];
          // Search import <specifiers> 'fs';
          let readFileSync;
          const fsImportDeclarations = path.parent.body
            .filter(isImportDeclaration)
            .filter(({ source: { value } }) => value === 'fs');
          if (
            !fsImportDeclarations.some(({ specifiers }) =>
              specifiers.find(specifier => {
                if (
                  isImportDefaultSpecifier(specifier) ||
                  isImportNamespaceSpecifier(specifier)
                ) {
                  readFileSync = memberExpression(
                    specifier.local,
                    identifier('readFileSync')
                  );
                  return true;
                }
                if (isImportSpecifier(specifier)) {
                  if (specifier.imported.name === 'readFileSync') {
                    readFileSync = specifier.local;
                    return true;
                  }
                }
              })
            )
          ) {
            // fs is not imported
            readFileSync = path.scope.generateUidIdentifier('readFileSync');
            // Add import { readFileSync as _readFileSync } from 'fs';
            path.insertBefore(
              importDeclaration(
                [importSpecifier(readFileSync, identifier('readFileSync'))],
                stringLiteral('fs')
              )
            );
          }
          // const <localName> = <readFileSync>(<args>);
          path.replaceWith(
            variableDeclaration('const', [
              variableDeclarator(
                local,
                callExpression(readFileSync, readFileSyncArgs)
              )
            ])
          );
          return true;
        });
      },
      CallExpression(path, { opts }) {
        if (path.node.callee.name === 'require') {
          const args = path.node.arguments;
          if (args.length) {
            const arg = args[0];
            if (isStringLiteral(arg)) {
              testOptions(opts, arg.value, readFileSyncArgs => {
                // require('fs').readFileSync(<args>)
                path.replaceWith(
                  callExpression(
                    memberExpression(
                      callExpression(identifier('require'), [
                        stringLiteral('fs')
                      ]),
                      identifier('readFileSync')
                    ),
                    readFileSyncArgs
                  )
                );
                return true;
              });
            }
          }
        }
      }
    }
  };
};
