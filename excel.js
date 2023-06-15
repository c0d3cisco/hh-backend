const ExcelJS = require('exceljs');

async function generateFilledExcel() {
  try {
    // Load the existing template
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('template.xlsx');

    // Get the worksheet you want to fill
    const worksheet = workbook.getWorksheet('Sheet1');

    // Modify the cells with your data
    //first name
    worksheet.getCell('C35').value = 'Isaac';
    //last name
    worksheet.getCell('H35').value = 'Sanchez';
    worksheet.getCell('N35').value = 'Cisco';
    worksheet.getCell('B58').value = '\u2612';
    worksheet.getCell('B65').value = '\u2612';

    // Save the filled Excel file
    await workbook.xlsx.writeFile('filled_file.xlsx');

    console.log('Filled Excel file generated successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the async function
generateFilledExcel();

