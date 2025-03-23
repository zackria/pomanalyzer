import { resolveVersion } from '../src/utils/dependencyResolver';

describe('resolveVersion', () => {
  it('should return the resolved version for a valid property reference', () => {
    const properties = { myVersion: ['1.0.0'] };
    const version = '${myVersion}';
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('1.0.0');
  });

  it('should return "N/A" for an unknown property reference', () => {
    const properties = { myVersion: ['1.0.0'] };
    const version = '${unknownVersion}';
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('N/A');
  });

  it('should return the version string if it is not a property reference', () => {
    const properties = {};
    const version = '2.0.0';
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('2.0.0');
  });

  it('should return "N/A" for an undefined version', () => {
    const properties = {};
    const version = undefined;
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('N/A');
  });

  it('should return "N/A" for a null version', () => {
    const properties = {};
    const version = null;
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('N/A');
  });

  it('should handle nested property references', () => {
    const properties = { 
      'outer.version': ['${inner.version}'],
      'inner.version': ['1.2.3'] 
    };
    const version = '${outer.version}';
    // Note: The current implementation doesn't resolve nested properties,
    // this test confirms current behavior
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('${inner.version}');
  });

  it('should handle property references with whitespace', () => {
    const properties = { 'my.version': ['1.0.0'] };
    const version = '${ my.version }'; // Notice the whitespace
    // Current implementation doesn't trim property names
    const resolved = resolveVersion(version, properties);
    expect(resolved).toBe('N/A');
  });
});