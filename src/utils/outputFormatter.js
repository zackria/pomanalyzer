
/**
 * Prints a list of dependencies in a table format.
 * @param {Array} dependencies - The list of dependencies to print.
 * @param {string} title - The title to display before the table.
 */
export const printTable = (dependencies, title) => {
  if (dependencies && dependencies.length > 0) {
    console.log(title);
    console.table(dependencies);
  } else {
    console.log(`${title}: No data available.`);
  }
};