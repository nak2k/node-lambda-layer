const { packPackages } = require('./packPackages');
const waterfall = require('run-waterfall');
const { request } = require('https');

function publishLayerVersion(options, callback) {
  const {
    LayerName,
    Description,
    CompatibleRuntimes,
    LicenseInfo,
    packages,
    verbose,
    sign,
  } = options;

  waterfall([
    packPackages.bind(null, options),

    ({ zip }, callback) =>
      zip.generateAsync({
        type: 'nodebuffer',
        platform: process.platform,
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      }).then(data => callback(null, data))
        .catch(err => callback(err)),

    (data, callback) => {
      if (verbose) {
        console.error(`Publish layer '${LayerName}'`);
      }

      const params = {
        CompatibleRuntimes,
        Content: {
          ZipFile: data.toString('base64'),
        },
        Description,
        LicenseInfo,
      };

      const body = JSON.stringify(params);

      const reqOptions = sign({
        service: 'lambda',
        path: `/2018-10-31/layers/${LayerName}/versions`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const req = request(reqOptions, res => {
        const { statusCode } = res;

        if (statusCode !== 201) {
          const err = new Error(`${res.statusMessage} for invoking PublishLayerVersion()`);
          return callback(err);
        }

        const data = [];

        res.on('data', chunk => data.push(chunk))
          .on('end', () => {
            const resBody = data.toString();

            if (verbose) {
              console.error(`Response '${resBody}'`);
            }

            let resJson;

            try {
              resJson = JSON.parse(resBody);
            } catch (err) {
              return callback(err);
            }

            callback(null, {
              response: resJson,
            });
          });
      });

      req.on('error', err => callback(err));

      req.end(reqOptions.body);
    },
  ], callback);
}

/*
 * Exports.
 */
exports.publishLayerVersion = publishLayerVersion;
