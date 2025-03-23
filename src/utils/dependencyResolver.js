// src/utils/dependencyResolver.js

/**
 * Resolves a Maven-style property placeholder in a version string.
 * 
 * @param {string|null} version - The version string that may contain a property placeholder (e.g., "${project.version}")
 * @param {Object} properties - An object containing property key-value pairs from the Maven POM file
 * @returns {string} The resolved version string or "N/A" if the version couldn't be resolved
 * 
 * @example
 * // If properties = { "project.version": ["1.0.0"] }
 * resolveVersion("${project.version}", properties) // returns "1.0.0"
 * 
 * @example
 * // If the property doesn't exist
 * resolveVersion("${unknown.property}", properties) // returns "N/A"
 * 
 * @example
 * // If version is a regular string
 * resolveVersion("2.1.0", properties) // returns "2.1.0"
 */
export const resolveVersion = (version, properties) => {
  if (version && version.startsWith('${') && version.endsWith('}')) {
    const propertyName = version.slice(2, -1);
    return properties[propertyName] ? properties[propertyName][0] : 'N/A';
  }
  return version || 'N/A';
};