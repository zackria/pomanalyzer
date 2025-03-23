import { readPomXml } from "./services/dependencyService.js";
import { checkForDuplicates } from "./services/duplicateChecker.js";
import { printTable } from "./utils/outputFormatter.js";
import { printHTMLTable } from "./utils/printHTMLTable.js";
import { printMarkdownTable } from "./utils/printMarkdownTable.js";
import chalk from "chalk"; // added Chalk import

export async function analyzePom(pomXmlPath, options = {}) {
  try {
    console.log(`Analyzing POM file: ${pomXmlPath}`);
    const dependencies = await readPomXml(pomXmlPath, options);

    if (dependencies && dependencies.length > 0) {
      printTable(dependencies, "Maven Dependencies");

      const duplicateDependencies = checkForDuplicates(dependencies);
      let duplicateSummary = [];
      if (duplicateDependencies.length > 0) {
        duplicateSummary = duplicateDependencies.map(depList => ({
          dependency: `${depList[0].groupId}:${depList[0].artifactId}`,
          versions: depList.map(dep => dep.version).join(", "),
        }));
      }
      
      // Generate additional reports if flags are provided.
      if (options.html) {
        printHTMLTable(dependencies, duplicateSummary, "Maven Dependencies", options.outputFolder);
      }
      if (options.markdown) {
        printMarkdownTable(dependencies, duplicateSummary, "Maven Dependencies", options.outputFolder);
      }


        if (duplicateSummary.length > 0) {
          console.log(chalk.yellow("Duplicate dependencies found:"));
          duplicateSummary.forEach(dup => {
            console.log(chalk.red(`${dup.dependency} -> ${dup.versions}`));
          });
        } else {
          console.log("No duplicate dependencies found.");
        
      }
    } else {
      console.log("No dependencies found in the POM file.");
    }
  } catch (error) {
    console.error("Error analyzing POM file:", error);
    throw error;
  }
}