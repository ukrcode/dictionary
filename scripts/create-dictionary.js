// utils
import fs from "fs/promises";
import path from "path";
import { parseYamlFiles } from "./utils/parse-yaml-files.js";

// config
import { allSourceFilePaths } from "./config.js";

// Main function
async function createDictionary() {
  try {
    console.log("Starting dictionary creation...");

    const parsedFiles = await parseYamlFiles(allSourceFilePaths);

    console.log(`\nSummary:`);
    console.log(`- Total files to read: ${allSourceFilePaths.length}`);
    console.log(`- Successfully parsed: ${parsedFiles.length}`);
    console.log(`- Failed to read/parse: ${allSourceFilePaths.length - parsedFiles.length}`);

    // Log file details
    parsedFiles.forEach((file) => {
      console.log(`  - ${file.filename}: ${file.termCount} terms`);
    });

    const [dateFormatted] = new Date().toISOString().split("T");

    // Convert to consolidated JSON structure
    const dictionary = {
      metadata: {
        title: "Ukrainian-English Front-end & Web Development Dictionary",
        title_uk: "Україно-англійський словник термінів фронт-енду і веб-розробки",
        created: dateFormatted,
        total_categories: parsedFiles.length,
        total_terms: parsedFiles.reduce((sum, file) => sum + file.termCount, 0),
      },
      categories: [],
      terms: [],
    };

    // Process each parsed file
    parsedFiles.forEach((file) => {
      if (file.parsedData?.category) {
        // Add category info
        dictionary.categories.push({
          id: file.parsedData.category.id,
          name_uk: file.parsedData.category.name_uk,
          name_en: file.parsedData.category.name_en,
          description_uk: file.parsedData.category.description_uk,
          description_en: file.parsedData.category.description_en,
          source_file: file.filename,
        });

        // Add terms with category reference
        if (file.parsedData.terms) {
          file.parsedData.terms.forEach((term) => {
            dictionary.terms.push({
              ...term,
              category_id: file.parsedData.category.id,
              // source_file: file.filename,
            });
          });
        }
      }
    });

    console.log(`\nDictionary JSON created:`);
    console.log(`- Total categories: ${dictionary.categories.length}`);
    console.log(`- Total terms: ${dictionary.terms.length}`);

    // Save JSON to file
    /*
    const jsonOutput = JSON.stringify(dictionary, null, 2);
    const outputPath = path.join(process.cwd(), "docs", "dictionary.json");

    try {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, jsonOutput, "utf8");
      console.log(`✓ Dictionary saved to: ${outputPath}`);
    } catch (saveError) {
      console.error(`✗ Error saving dictionary:`, saveError.message);
    }
    */

    return dictionary;
  } catch (error) {
    console.error("Error creating dictionary:", error);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  createDictionary()
    .then(() => {
      console.log("\nDictionary creation completed!");
    })
    .catch((error) => {
      console.error("Script failed:", error);
      process.exit(1);
    });
}
