import semver from "semver";

const requiredVersion = '18.0.0'; // Set your required Node.js version here


export const verifyNodeVersion = () => {
  if (!semver.satisfies(process.version, `>=${requiredVersion}`)) {
    console.warn(
      `Warning: Your Node.js version (${process.version}) does not meet the required version (${requiredVersion}). Some features may not work as expected.`
    );
    return false;
  } else {
    return true;
  }
}

