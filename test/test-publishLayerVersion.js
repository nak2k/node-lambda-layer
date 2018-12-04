const test = require('tape');
const { publishLayerVersion } = require('..');
const { makeSigner } = require('aws4-with-assume-role');

test('test publishLayerVersion()', t => {
  t.plan(1);

  makeSigner((err, sign) => {
    if (err) {
      throw err;
    }

    publishLayerVersion({
      LayerName: 'test-layer',
      Description: 'test layer',
      LicenseInfo: 'MIT',

      packages: [
        {
          package: {
            dependencies: {
              debug: '^4.0.0',
            }
          },
        },
        {
          package: {
            dependencies: {
              debug: '^4.1.0',
            },
          },
        },
      ],
      cacheBaseDir: __dirname + '/tmp/publishLayerVersion',
      verbose: true,
      sign,
    }, (err, result) => {
      t.error(err);
    });
  });
});
