import fs from "fs/promises";
import path from "path";
import { parse as parseYaml } from "yaml";

export async function parseYamlFiles(filePaths) {
  console.log("Reading and parsing YAML files...");

  const parsedFiles = [];

  for (const filePath of filePaths) {
    try {
      console.log(`Reading: ${filePath}`);

      // Check if file exists
      await fs.access(filePath);

      // Read file content
      const content = await fs.readFile(filePath, "utf8");

      // Parse YAML to JavaScript object
      let parsedData;
      try {
        parsedData = parseYaml(content);
        console.log(`✓ Parsed ${path.basename(filePath)} successfully`);
      } catch (yamlError) {
        console.error(`✗ YAML parsing error in ${path.basename(filePath)}:`, yamlError.message);
        continue;
      }

      parsedFiles.push({
        path: filePath,
        filename: path.basename(filePath),
        originalContent: content,
        parsedData: parsedData,
        termCount: parsedData?.terms?.length || 0,
        category: parsedData?.category || null,
      });

      console.log(`  - Category: ${parsedData?.category?.name_en || "Unknown"}`);
      console.log(`  - Terms: ${parsedData?.terms?.length || 0}`);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log(`⚠ File not found: ${filePath}`);
      } else {
        console.error(`✗ Error reading ${filePath}:`, error.message);
      }
    }
  }

  return parsedFiles;
}
