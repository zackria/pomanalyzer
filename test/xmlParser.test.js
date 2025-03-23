import { parseXml } from '../src/utils/xmlParser';
import xml2js from 'xml2js';

jest.mock('xml2js');

describe('XML Parser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should parse valid XML content into a JavaScript object', async () => {
    const xmlContent = '<project><properties><prop>value</prop></properties></project>';
    const expectedResult = {
      project: {
        properties: [{ prop: ['value'] }]
      }
    };

    xml2js.Parser.mockImplementation(() => ({
      parseString: (content, callback) => {
        expect(content).toBe(xmlContent);
        callback(null, expectedResult);
      }
    }));

    const result = await parseXml(xmlContent);
    expect(result).toEqual(expectedResult);
  });

  it('should reject the promise when XML parsing fails', async () => {
    const xmlContent = '<invalid>xml';
    const errorMsg = 'XML parsing error';

    xml2js.Parser.mockImplementation(() => ({
      parseString: (content, callback) => {
        callback(new Error(errorMsg), null);
      }
    }));

    await expect(parseXml(xmlContent)).rejects.toThrow('Error parsing XML: ' + errorMsg);
  });

  it('should handle empty XML content', async () => {
    const xmlContent = '';
    const expectedResult = {};

    xml2js.Parser.mockImplementation(() => ({
      parseString: (content, callback) => {
        callback(null, expectedResult);
      }
    }));

    const result = await parseXml(xmlContent);
    expect(result).toEqual(expectedResult);
  });

  it('should use the xml2js Parser with default options', async () => {
    const xmlContent = '<project></project>';
    const mockParseString = jest.fn((content, callback) => {
      callback(null, {});
    });

    xml2js.Parser.mockImplementation(() => ({
      parseString: mockParseString
    }));

    await parseXml(xmlContent);
    expect(mockParseString).toHaveBeenCalledWith(xmlContent, expect.any(Function));
    expect(xml2js.Parser).toHaveBeenCalledWith();
  });
});