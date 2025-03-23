import { printTable } from '../src/utils/outputFormatter';

describe('Output Formatter', () => {
  let consoleLogSpy, consoleTableSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleTableSpy = jest.spyOn(console, 'table').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleTableSpy.mockRestore();
  });

  it('should print a title and table for non-empty dependencies', () => {
    const dependencies = [
      { groupId: 'com.example', artifactId: 'example-artifact', version: '1.0.0' }
    ];
    const title = 'Test Dependencies';

    printTable(dependencies, title);

    expect(consoleLogSpy).toHaveBeenCalledWith(title);
    expect(consoleTableSpy).toHaveBeenCalledWith(dependencies);
  });

  it('should print a message for empty dependencies', () => {
    const dependencies = [];
    const title = 'Empty Dependencies';

    printTable(dependencies, title);

    expect(consoleLogSpy).toHaveBeenCalledWith(`${title}: No data available.`);
    expect(consoleTableSpy).not.toHaveBeenCalled();
  });

  it('should handle null dependencies', () => {
    const dependencies = null;
    const title = 'Null Dependencies';

    printTable(dependencies, title);

    expect(consoleLogSpy).toHaveBeenCalledWith(`${title}: No data available.`);
    expect(consoleTableSpy).not.toHaveBeenCalled();
  });

  it('should handle undefined dependencies', () => {
    const dependencies = undefined;
    const title = 'Undefined Dependencies';

    printTable(dependencies, title);

    expect(consoleLogSpy).toHaveBeenCalledWith(`${title}: No data available.`);
    expect(consoleTableSpy).not.toHaveBeenCalled();
  });
});
