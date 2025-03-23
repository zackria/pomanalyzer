import fs from 'fs';
import path from 'path';

/**
 * Generates and saves an HTML table for the given dependencies.
 * @param {Array} dependencies - The list of dependencies to include in the table.
 * @param {Array} duplicateDependencies - The list of duplicate dependencies to include in the table.
 * @param {string} title - The title to display before the table.
 * @param {string} [folderPath='.'] - The folder path to save the HTML file.
 */
export const printHTMLTable = (dependencies, duplicateDependencies, title, folderPath = '.') => {
  // Construct a rich HTML report with embedded CSS.
  const style = `<style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .duplicate { background-color: #ffcccc; }
  </style>`;
  
  // Maven Dependencies table.
  const depHeaders = Object.keys(dependencies[0] || {});
  const dependenciesTable = `
    <h2>${title}</h2>
    <table>
      <thead>
        <tr>
          ${depHeaders.map(key => `<th>${key}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${dependencies.map(dep => `
          <tr>
            ${Object.values(dep).map(val => `<td>${val}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  // Duplicate Dependencies table (if any).
  let duplicateTable = '';
  if (duplicateDependencies && duplicateDependencies.length > 0) {
    const dupHeaders = Object.keys(duplicateDependencies[0] || {});
    duplicateTable = `
      <h2>Duplicate Dependencies</h2>
      <table>
        <thead>
          <tr>
            ${dupHeaders.map(key => `<th>${key}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${duplicateDependencies.map(dep => `
            <tr class="duplicate">
              ${Object.values(dep).map(val => `<td>${val}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }
  
  const htmlContent = `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title} Report</title>
        ${style}
      </head>
      <body>
        ${dependenciesTable}
        ${duplicateTable}
      </body>
    </html>
  `;
  
  const filePath = path.join(folderPath, `${title.replace(/\s+/g, '_')}_report.html`);
  
  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  fs.writeFileSync(filePath, htmlContent);
  console.log(`HTML report saved to ${filePath}`);
};