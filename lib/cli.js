const yargs = require('yargs');
const { showError } = require('./showError');
const { makeSigner } = require('aws4-with-assume-role');
const { tmpdir } = require('os');
const readJson = require('read-json');
const parallel = require('run-parallel');
const { publishLayerVersion } = require('./publishLayerVersion');

function main(callback) {
  const argv = yargs
    .options({
      'layer-name': {
        demandOption: true,
        type: 'string',
      },
      description: {
        type: 'string',
      },
      'compatible-runtimes': {
        type: 'array',
        default: 'nodejs8.10',
      },
        'license-info': {
        type: 'string',
      },
      packages: {
        type: 'array',
        default: 'package.json',
      },
      profile: {
        describe: 'A profile of AWS CLI',
        type: 'string',
      },
      region: {
        describe: 'AWS region',
        type: 'string',
      },
      verbose: {
        alias: 'v',
        describe: 'Verbose mode',
        type: 'boolean',
      },
    })
    .version()
    .help()
    .argv;

  makeSigner({
    profile: argv.profile,
    region: argv.region,
  }, (err, sign) => {
    if (err) {
      return callback(err);
    }

    const tasks = argv.packages.map(pkgPath => callback => {
      readJson(pkgPath, (err, json) => {
        if (err) {
          return callback(err);
        }

        callback(null, {
          package: json,
        });
      });
    });

    parallel(tasks, (err, packages) => {
      if (err) {
        return callback(err);
      }

      publishLayerVersion({
        LayerName: argv.layerName,
        Description: argv.description,
        CompatibleRuntimes: argv.compatibleRuntimes,
        LicenseInfo: argv.licenseInfo,
        packages,
        cacheBaseDir: `${tmpdir()}/lambda-layer`,
        verbose: argv.verbose,
        sign,
      }, err => {
        if (err) {
          return callback(err);
        }

        callback(null);
      });
    });
  });
}

main(err => {
  if (err) {
    showError(err);
    process.exit(1);
  }
});
