# POM Analyzer Documentation

This document provides an overview of the functionality of each JavaScript file in the project.

---

## `/src/services/dependencyService.js`

### Description
This file contains functions to read and parse Maven `pom.xml` files and extract dependencies.

### Functions
1. **`readPomXml(filePath)`**
   - Reads and parses a Maven `pom.xml` file.
   - **Parameters**: 
     - `filePath` (string): Path to the `pom.xml` file.
   - **Returns**: A promise that resolves to an array of dependencies.

2. **`extractDependencies(result)`**
   - Extracts dependencies from the parsed XML result.
   - **Parameters**: 
     - `result` (Object): Parsed XML result.
   - **Returns**: An array of dependencies.

---

## `/cli.js`

### Description
This file serves as the command-line interface for the POM Analyzer. It uses the `commander` library to parse CLI arguments and options.

### Key Features
- Displays version and usage information.
- Accepts options for generating HTML and Markdown reports.
- Invokes the `analyzePom` function to analyze the provided `pom.xml` file.

---

## `/src/index.js`

### Description
This file contains the main logic for analyzing Maven `pom.xml` files. It integrates various services and utilities to process dependencies and generate reports.

### Functions
1. **`analyzePom(pomXmlPath, options)`**
   - Analyzes the provided `pom.xml` file.
   - **Parameters**:
     - `pomXmlPath` (string): Path to the `pom.xml` file.
     - `options` (Object): Options for generating reports (HTML, Markdown, etc.).
   - **Behavior**:
     - Reads dependencies using `readPomXml`.
     - Checks for duplicate dependencies.
     - Generates reports based on the provided options.

---

## `/src/utils/xmlParser.js`

### Description
This file provides a utility function to parse XML content into a JavaScript object using the `xml2js` library.

### Functions
1. **`parseXml(xmlContent)`**
   - Parses XML content and returns a JavaScript object.
   - **Parameters**:
     - `xmlContent` (string): XML content to parse.
   - **Returns**: A promise that resolves to the parsed object.

---

## `/src/utils/printMarkdownTable.js`

### Description
This file contains a function to generate and save a Markdown report for dependencies and duplicate dependencies.

### Functions
1. **`printMarkdownTable(dependencies, duplicateDependencies, title, folderPath)`**
   - Generates and saves a Markdown table.
   - **Parameters**:
     - `dependencies` (Array): List of dependencies.
     - `duplicateDependencies` (Array): List of duplicate dependencies.
     - `title` (string): Title of the report.
     - `folderPath` (string): Folder path to save the Markdown file.

---

## `/src/utils/printHTMLTable.js`

### Description
This file contains a function to generate and save an HTML report for dependencies and duplicate dependencies.

### Functions
1. **`printHTMLTable(dependencies, duplicateDependencies, title, folderPath)`**
   - Generates and saves an HTML table.
   - **Parameters**:
     - `dependencies` (Array): List of dependencies.
     - `duplicateDependencies` (Array): List of duplicate dependencies.
     - `title` (string): Title of the report.
     - `folderPath` (string): Folder path to save the HTML file.

---

## `/src/utils/outputFormatter.js`

### Description
This file provides a utility function to print dependencies in a tabular format to the console.

### Functions
1. **`printTable(dependencies, title)`**
   - Prints a list of dependencies in a table format.
   - **Parameters**:
     - `dependencies` (Array): List of dependencies.
     - `title` (string): Title of the table.

---

## `/src/utils/fileUtils.js`

### Description
This file contains utility functions for file operations, such as reading files.

### Functions
1. **`readFile(filePath)`**
   - Reads a file and returns its content.
   - **Parameters**:
     - `filePath` (string): Path to the file.
   - **Returns**: A promise that resolves to the file content.

---

## `/src/utils/dependencyResolver.js`

### Description
This file provides a utility function to resolve Maven-style property placeholders in version strings.

### Functions
1. **`resolveVersion(version, properties)`**
   - Resolves a Maven-style property placeholder in a version string.
   - **Parameters**:
     - `version` (string): Version string with a placeholder.
     - `properties` (Object): Key-value pairs of Maven properties.
   - **Returns**: Resolved version string or "N/A" if unresolved.

---

## `/src/services/duplicateChecker.js`

### Description
This file contains a function to identify duplicate dependencies based on `groupId` and `artifactId`.

### Functions
1. **`checkForDuplicates(dependencies)`**
   - Identifies duplicate dependencies.
   - **Parameters**:
     - `dependencies` (Array): List of dependencies.
   - **Returns**: List of duplicate dependencies grouped by `groupId:artifactId`.

