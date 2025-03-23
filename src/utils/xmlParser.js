// src/utils/xmlParser.js

import xml2js from 'xml2js';

/**
 * Parses XML content and returns a JavaScript object.
 * @param {string} xmlContent - The XML content to parse.
 * @returns {Promise<Object>} - A promise that resolves to the parsed object.
 */
export const parseXml = (xmlContent) => {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser();
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(new Error('Error parsing XML: ' + err.message));
      } else {
        resolve(result);
      }
    });
  });
};