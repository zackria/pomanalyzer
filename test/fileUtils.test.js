import { readFile } from '../src/utils/fileUtils';
import fs from 'node:fs';

jest.mock('node:fs');

describe('File Utils', () => {
  const mockFilePath = 'mock/path/to/file.txt';
  const mockFileContent = 'Hello, World!';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read file content correctly', async () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(null, mockFileContent);
    });

    const content = await readFile(mockFilePath);
    expect(content).toBe(mockFileContent);
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8', expect.any(Function));
  });

  it('should reject promise when file read fails', async () => {
    const mockError = new Error('File not found');
    fs.readFile.mockImplementation((path, encoding, callback) => {
      callback(mockError, null);
    });

    await expect(readFile(mockFilePath)).rejects.toThrow('File not found');
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8', expect.any(Function));
  });

  it('should handle non-UTF8 encodings if specified', async () => {
    fs.readFile.mockImplementation((path, encoding, callback) => {
      expect(encoding).toBe('utf-8'); // Default encoding
      callback(null, mockFileContent);
    });

    await readFile(mockFilePath);
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8', expect.any(Function));
  });
});