// src/services/dependencyService.js
import { readFile } from '../utils/fileUtils.js';
import { parseXml } from '../utils/xmlParser.js';
import { resolveVersion } from '../utils/dependencyResolver.js';

/**
 * Reads and parses a Maven pom.xml file.
 * @param {string} filePath - The path to the pom.xml file.
 * @returns {Promise<Array>} - A promise that resolves to an array of dependencies.
 */
export async function readPomXml(filePath) {
  try {
    const xmlContent = await readFile(filePath);
    const result = await parseXml(xmlContent); // Use await here
    const dependencies = extractDependencies(result);
    return dependencies;
  } catch (error) {
    throw new Error(`Error reading pom.xml: ${error.message}`);
  }
}

/**
 * Extracts dependencies from the parsed XML result.
 * @param {Object} result - The parsed XML result.
 * @returns {Array} - An array of dependencies.
 */
function extractDependencies(result) {
  const dependencies = [];
  
  if (!result || !result.project) {
    return dependencies;
  }
  
  const properties = result.project.properties ? result.project.properties[0] : {};

  if (result.project.dependencies && result.project.dependencies[0] && result.project.dependencies[0].dependency) {
    dependencies.push(
      ...result.project.dependencies[0].dependency.map((dep) => ({
        groupId: dep.groupId ? dep.groupId[0] : 'unknown',
        artifactId: dep.artifactId ? dep.artifactId[0] : 'unknown',
        version: resolveVersion(dep.version && dep.version[0] ? dep.version[0] : 'N/A', properties),
      }))
    );
  }

  if (result.project.dependencyManagement && 
      result.project.dependencyManagement[0] && 
      result.project.dependencyManagement[0].dependencies && 
      result.project.dependencyManagement[0].dependencies[0] &&
      result.project.dependencyManagement[0].dependencies[0].dependency) {
    dependencies.push(
      ...result.project.dependencyManagement[0].dependencies[0].dependency.map((dep) => ({
        groupId: dep.groupId ? dep.groupId[0] : 'unknown',
        artifactId: dep.artifactId ? dep.artifactId[0] : 'unknown',
        version: resolveVersion(dep.version && dep.version[0] ? dep.version[0] : 'N/A', properties),
      }))
    );
  }

  return dependencies;
}