# Translation File Generator for WordPress

The **Translation File Generator** is a tool for converting Excel spreadsheets into translation files (.po/.mo) used in WordPress themes and plugins. This tool simplifies the process of managing translations by allowing you to generate necessary localization files directly from Excel files.

## Features

- Convert Excel spreadsheets to .po and .mo files
- Streamlined UI for easy file uploads
- Automatically saves generated files in the `output` folder

## Installation

Ensure you have [Node.js](https://nodejs.org/) installed. Then, clone this repository and install the necessary dependencies:

```bash
git clone https://github.com/afshintalebi/wp-translation-generator.git
cd translation-file-generator
npm install
```

## Running the Tool

To start the tool, use the following command:

```bash
npm start
```

Once the server is running, open your browser and navigate to:

```bash
http://localhost:3000
```

### Uploading Your Excel File

- On the web interface, click the file upload area.
- Select and upload your Excel file.
- The tool will process the file and generate the translation files.
- The generated .po and .mo files will be saved in the `output` folder within the project directory.
- There is a sample Excel file in the root of the project.