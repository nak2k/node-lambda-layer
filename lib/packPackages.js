const { packDeps } = require('pack-deps');
const { mergeDeps } = require('./mergeDeps');

function packPackages(options, callback) {
  mergeDeps(options, (err, pkgJson) => {
    if (err) {
      return callback(err);
    }

    packDeps({
      pkgJson,
      production: true,
      cacheBaseDir: options.cacheBaseDir,
      baseDirInZip: 'nodejs',
    }, callback);
  });
}

/*
 * Exports.
 */
exports.packPackages = packPackages;
