export const dep = (groupId = 'unknown', artifactId = 'unknown', version = 'N/A') => ({
  groupId,
  artifactId,
  version,
});

export const pomDep = (groupId, artifactId, version) => {
  const obj = {};
  if (groupId !== undefined) obj.groupId = [groupId];
  if (artifactId !== undefined) obj.artifactId = [artifactId];
  if (version !== undefined) obj.version = [version];
  return obj;
};

export const wrapDependencies = (depsArray) => ({
  project: {
    dependencies: [{ dependency: depsArray }],
  },
});

export const wrapDependencyManagement = (depsArray) => ({
  project: {
    dependencyManagement: [{ dependencies: [{ dependency: depsArray }] }],
  },
});

export const wrapBoth = (depsArray, managedArray) => ({
  project: {
    dependencies: [{ dependency: depsArray }],
    dependencyManagement: [{ dependencies: [{ dependency: managedArray }] }],
  },
});

export const wrapProperties = (props) => ({ project: { properties: [props] } });

export async function runReadPom(parseXmlMock, mockParsedXml, readPomFn, mockFilePath = 'mock/path/to/pom.xml') {
  parseXmlMock.mockResolvedValue(mockParsedXml);
  return await readPomFn(mockFilePath);
}
