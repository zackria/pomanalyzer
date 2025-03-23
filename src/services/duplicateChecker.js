/**
 * Identifies duplicate dependencies based on groupId and artifactId.
 * @param {Array} dependencies - List of dependencies from the POM file.
 * @returns {Array} - List of duplicate dependencies grouped by groupId:artifactId.
 */
export function checkForDuplicates(dependencies) {
  const duplicates = dependencies.reduce((acc, dep) => {
    const key = `${dep.groupId}:${dep.artifactId}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(dep);
    return acc;
  }, {});

  return Object.values(duplicates).filter((depList) => depList.length > 1);
}