function mergeDeps(options, callback) {
  const {
    packages,
  } = options;

  const mergedPackage = {
    dependencies: {},
  };

  packages.forEach(({ package }) => {
    const {
      dependencies = {},
    } = package;

    Object.keys(dependencies).forEach(pkgName => {
      const pkgVersion = dependencies[pkgName];
      const mergedVersion = mergedPackage.dependencies[pkgName];

      mergedPackage.dependencies[pkgName] = mergedVersion
        ? `${mergedVersion} ${pkgVersion}`
        : pkgVersion;
    });
  });

  callback(null, mergedPackage);
}

/*
 * Exports.
 */
exports.mergeDeps = mergeDeps;
