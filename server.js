import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import gettextParser from "gettext-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

app.post("/upload", upload.single("file"), (req, res) => {
  const filePath = req.file.path;

  // Read Excel file
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = xlsx.utils.sheet_to_json(sheet);

  // Extract all unique language codes from the headers
  const headers = Object.keys(data[0]);
  const languageColumns = headers.filter((header) =>
    header.toLowerCase().includes("translation")
  );

  const languageCodes = headers.filter((header) =>
    header.toLowerCase().includes("language code")
  );

  const languages = {};
  languageColumns.forEach((translationHeader, index) => {
    const languageCode = data[index][languageCodes[index]];
    if (languageCode) {
      languages[languageCode] = {
        charset: "UTF-8",
        headers: { "content-type": "text/plain; charset=UTF-8" },
        translations: { "": {} },
      };
    }
  });

  // Populate translations for each language
  data.forEach((row) => {
    const msgid = row["Language ID"];
    if (msgid) {
      languageColumns.forEach((translationHeader, index) => {
        // const languageCode = translationHeader.match(/\(([^)]+)\)/)?.[1]; // Extract language code
        const languageCode = row[languageCodes[index]];
        const translation = row[translationHeader];
        if (languageCode && translation) {
          languages[languageCode].translations[""][msgid] = {
            msgid,
            msgstr: [translation],
          };
        }
      });
    }
  });

  // Generate .po and .mo files for each language
  const outputFiles = [];
  for (const [languageCode, poContent] of Object.entries(languages)) {
    const po = gettextParser.po.compile(poContent);
    const poFilePath = path.join(__dirname, "output", `${languageCode}.po`);
    fs.writeFileSync(poFilePath, po);

    const mo = gettextParser.mo.compile(poContent);
    const moFilePath = path.join(__dirname, "output", `${languageCode}.mo`);
    fs.writeFileSync(moFilePath, mo);

    outputFiles.push({
      poFile: `${languageCode}.po`,
      moFile: `${languageCode}.mo`,
    });
  }

  // Clean up uploaded file
  fs.unlinkSync(filePath);

  res.json({ files: outputFiles });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
