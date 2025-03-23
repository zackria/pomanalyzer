#!/usr/bin/env node

import { program } from 'commander';
import { analyzePom } from './src/index.js';
import { readFileSync } from 'fs';
import path from 'path';

// Get version from package.json
let version = '1.0.0';

try {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  version = packageJson.version;
} catch (err) {
  // Use default version if package.json can't be read
}

// Check if no arguments were provided
if (process.argv.length <= 2) {
  console.log(`pomanalyzer v${version}`);
  console.log('Usage: pomanalyzer [options] <pomFile>');
  process.exit(0);
}

program
  .version(version)
  .description('Analyze Maven POM XML files')
  .option('--html', 'Generate HTML report')
  .option('--markdown', 'Generate Markdown report')
  .option('--output-folder <path>', 'Output folder for results')
  .option('-v, --verbose', 'Show verbose output')
  .arguments('<pomFile>')
  .usage('[options] <pomFile>')
  .action(async (pomFile, options) => {
    try {
      // Resolve file path
      const resolvedPath = path.resolve(pomFile);
      
      // Prepare options for analysis
      const analysisOptions = {
        html: options.html,
        markdown: options.markdown,
        outputFolder: options.outputFolder,
        verbose: options.verbose
      };

      // Use the centralized analyzePom function
      await analyzePom(resolvedPath, analysisOptions);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);
