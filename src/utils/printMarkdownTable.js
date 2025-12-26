import fs from 'node:fs';
import path from 'node:path';

/**
 * Generates and saves a Markdown table for the given dependencies.
 * @param {Array} dependencies - The list of dependencies to include in the table.
 * @param {Array} duplicateDependencies - The list of duplicate dependencies to include in the table.
 * @param {string} title - The title to display before the table.
 * @param {string} [folderPath='.'] - The folder path to save the Markdown file.
 */
export const printMarkdownTable = (dependencies, duplicateDependencies, title, folderPath = '.') => {
  const depHeaders = Object.keys(dependencies[0] || {});
  const dependenciesTable = `
## ${title}

| ${depHeaders.join(' | ')} |
| ${depHeaders.map(() => '---').join(' | ')} |
${dependencies.map(dep => `| ${Object.values(dep).join(' | ')} |`).join('\n')}
  `;

  let duplicateTable = '';
  if (duplicateDependencies && duplicateDependencies.length > 0) {
    const dupHeaders = Object.keys(duplicateDependencies[0] || {});
    duplicateTable = `
## Duplicate Dependencies

| ${dupHeaders.join(' | ')} |
| ${dupHeaders.map(() => '---').join(' | ')} |
${duplicateDependencies.map(dep => `| ${Object.values(dep).join(' | ')} |  <!-- duplicate row -->`).join('\n')}
    `;
  }

  const markdownContent = `
# Report

${dependenciesTable}

${duplicateTable}
  `;

  const filePath = path.join(folderPath, `${title.replaceAll(/\s+/g, '_')}_report.md`);

  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, markdownContent.trim());
  console.log(`Markdown report saved to ${filePath}`);
};