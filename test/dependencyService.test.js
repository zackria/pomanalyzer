import { readPomXml } from '../src/services/dependencyService';
import { readFile } from '../src/utils/fileUtils';
import { parseXml } from '../src/utils/xmlParser';
import { resolveVersion } from '../src/utils/dependencyResolver';

jest.mock('../src/utils/fileUtils');
jest.mock('../src/utils/xmlParser');
jest.mock('../src/utils/dependencyResolver');

describe('Dependency Service', () => {
  const mockFilePath = 'mock/path/to/pom.xml';
  const mockXmlContent = '<project></project>';

  beforeEach(() => {
    jest.clearAllMocks();
    readFile.mockResolvedValue(mockXmlContent);
    resolveVersion.mockImplementation((version) => version === 'N/A' ? 'N/A' : version);
  });

  it('should read and parse pom.xml file correctly with regular dependencies', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: ['1.0.0']
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(readFile).toHaveBeenCalledWith(mockFilePath);
    expect(parseXml).toHaveBeenCalledWith(mockXmlContent);
    expect(dependencies).toEqual([
      { groupId: 'com.example', artifactId: 'example-artifact', version: '1.0.0' }
    ]);
  });

  it('should handle dependency management section', async () => {
    const mockParsedXml = {
      project: {
        dependencyManagement: [{
          dependencies: [{
            dependency: [
              {
                groupId: ['org.managed'],
                artifactId: ['managed-artifact'],
                version: ['2.0.0']
              }
            ]
          }]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'org.managed', artifactId: 'managed-artifact', version: '2.0.0' }
    ]);
  });

  it('should handle both regular dependencies and dependency management', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: ['1.0.0']
            }
          ]
        }],
        dependencyManagement: [{
          dependencies: [{
            dependency: [
              {
                groupId: ['org.managed'],
                artifactId: ['managed-artifact'],
                version: ['2.0.0']
              }
            ]
          }]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toHaveLength(2);
    expect(dependencies).toContainEqual({ groupId: 'com.example', artifactId: 'example-artifact', version: '1.0.0' });
    expect(dependencies).toContainEqual({ groupId: 'org.managed', artifactId: 'managed-artifact', version: '2.0.0' });
  });

  it('should handle dependencies with missing fields', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              // Missing groupId
              artifactId: ['example-artifact'],
              version: ['1.0.0']
            },
            {
              groupId: ['com.example'],
              // Missing artifactId
              version: ['1.0.0']
            },
            {
              groupId: ['com.example2'],
              artifactId: ['example-artifact2']
              // Missing version
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'unknown', artifactId: 'example-artifact', version: '1.0.0' },
      { groupId: 'com.example', artifactId: 'unknown', version: '1.0.0' },
      { groupId: 'com.example2', artifactId: 'example-artifact2', version: 'N/A' }
    ]);
  });

  it('should handle property resolution in versions', async () => {
    const mockParsedXml = {
      project: {
        properties: [{ 'project.version': ['3.0.0'] }],
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: ['${project.version}']
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);
    resolveVersion.mockImplementation((version) => version === '${project.version}' ? '3.0.0' : version);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'com.example', artifactId: 'example-artifact', version: '3.0.0' }
    ]);
  });

  it('should return empty array if no project element in XML', async () => {
    parseXml.mockResolvedValue({});
    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([]);
  });

  it('should return empty array if no dependencies in project', async () => {
    parseXml.mockResolvedValue({ project: {} });
    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([]);
  });

  it('should handle errors when reading the file', async () => {
    readFile.mockRejectedValue(new Error('File read error'));
    await expect(readPomXml(mockFilePath)).rejects.toThrow('Error reading pom.xml: File read error');
  });

  it('should handle errors when parsing XML', async () => {
    readFile.mockResolvedValue(mockXmlContent);
    parseXml.mockRejectedValue(new Error('XML parse error'));
    await expect(readPomXml(mockFilePath)).rejects.toThrow('Error reading pom.xml: XML parse error');
  });

  it('should handle empty dependencies array in project', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: []
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([]);
  });

  it('should handle empty dependencyManagement array in project', async () => {
    const mockParsedXml = {
      project: {
        dependencyManagement: [{
          dependencies: [{
            dependency: []
          }]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([]);
  });

  it('should handle missing dependencyManagement section', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: ['1.0.0']
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'com.example', artifactId: 'example-artifact', version: '1.0.0' }
    ]);
  });

  it('should handle missing dependencies section', async () => {
    const mockParsedXml = {
      project: {
        dependencyManagement: [{
          dependencies: [{
            dependency: [
              {
                groupId: ['org.managed'],
                artifactId: ['managed-artifact'],
                version: ['2.0.0']
              }
            ]
          }]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'org.managed', artifactId: 'managed-artifact', version: '2.0.0' }
    ]);
  });

  it('should handle missing properties section', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: ['${project.version}']
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);
    resolveVersion.mockImplementation((version) => version === '${project.version}' ? 'N/A' : version);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'com.example', artifactId: 'example-artifact', version: 'N/A' }
    ]);
  });

  it('should handle empty project object', async () => {
    const mockParsedXml = { project: {} };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([]);
  });

  it('should handle null version in dependency', async () => {
    const mockParsedXml = {
      project: {
        dependencies: [{
          dependency: [
            {
              groupId: ['com.example'],
              artifactId: ['example-artifact'],
              version: [null]
            }
          ]
        }]
      }
    };
    parseXml.mockResolvedValue(mockParsedXml);

    const dependencies = await readPomXml(mockFilePath);
    expect(dependencies).toEqual([
      { groupId: 'com.example', artifactId: 'example-artifact', version: 'N/A' }
    ]);
  });
});