import { checkForDuplicates } from '../src/services/duplicateChecker';
import { dep } from './testHelpers';

describe('checkForDuplicates', () => {
  it('should return an empty array when there are no duplicates', () => {
    const dependencies = [
      dep('com.example', 'example-artifact', '1.0.0'),
      dep('org.sample', 'sample-artifact', '2.0.0'),
    ];
    const result = checkForDuplicates(dependencies);
    expect(result).toEqual([]);
  });

  it('should identify duplicates based on groupId and artifactId', () => {
    const dependencies = [
      dep('com.example', 'example-artifact', '1.0.0'),
      dep('com.example', 'example-artifact', '1.1.0'),
      dep('org.sample', 'sample-artifact', '2.0.0'),
      dep('org.sample', 'sample-artifact', '2.1.0'),
    ];
    const result = checkForDuplicates(dependencies);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(2);
    expect(result[0][0]).toEqual({ groupId: 'com.example', artifactId: 'example-artifact', version: '1.0.0' });
    expect(result[0][1]).toEqual({ groupId: 'com.example', artifactId: 'example-artifact', version: '1.1.0' });
    
    expect(result[1]).toHaveLength(2);
    expect(result[1][0]).toEqual({ groupId: 'org.sample', artifactId: 'sample-artifact', version: '2.0.0' });
    expect(result[1][1]).toEqual({ groupId: 'org.sample', artifactId: 'sample-artifact', version: '2.1.0' });
  });

  it('should not consider different artifactIds as duplicates even with same groupId', () => {
    const dependencies = [
      dep('com.example', 'example-artifact-1', '1.0.0'),
      dep('com.example', 'example-artifact-2', '1.0.0'),
    ];
    const result = checkForDuplicates(dependencies);
    expect(result).toEqual([]);
  });

  it('should not consider different groupIds as duplicates even with same artifactId', () => {
    const dependencies = [
      dep('com.example1', 'example-artifact', '1.0.0'),
      dep('com.example2', 'example-artifact', '1.0.0'),
    ];
    const result = checkForDuplicates(dependencies);
    expect(result).toEqual([]);
  });

  it('should handle an empty array of dependencies', () => {
    const dependencies = [];
    const result = checkForDuplicates(dependencies);
    expect(result).toEqual([]);
  });

  it('should include multiple versions in the duplicate groups', () => {
    const dependencies = [
      dep('com.example', 'example-artifact', '1.0.0'),
      dep('com.example', 'example-artifact', '1.1.0'),
      dep('com.example', 'example-artifact', '1.2.0'),
    ];
    const result = checkForDuplicates(dependencies);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(3);
  });
});