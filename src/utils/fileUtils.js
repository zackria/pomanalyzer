// This file contains utility functions for file operations, such as reading files.

import fs from 'fs';

/**
 * Reads a file and returns its content.
 * @param {string} filePath - The path to the file to read.
 * @returns {Promise<string>} - A promise that resolves to the file content.
 */
export const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};