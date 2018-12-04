# lambda-layer

Create lambda layers for Node.js.

## Installation

```
npm i lambda-layer
```

## CLI

```
$ lambda-layer --layer-name MyLayer \
               --description 'My Layer' \
               --compatible-runtime nodejs8.10 \
               --license-info MIT \
               --packages function1/package.json function2/package.json
```

The `lambda-layer` command creates a lambda layer.

The layer contains packages that is specified by `dependencies` of `package.json` that is specified by the `--packages` option.

## License

MIT
