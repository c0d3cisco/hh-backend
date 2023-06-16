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
    // preferred name
    worksheet.getCell('N35').value = 'Cisco';
    //date of birth
    worksheet.getCell('C37').value = '\u2612';
    //pronouns
    worksheet.getCell('H37').value = '\u2612';
    //email
    worksheet.getCell('D39').value = '\u2612';
    //!phone
    worksheet.getCell('D34').value = '\u2612';
    //!safe to contact
    worksheet.getCell('B58').value = '\u2612';
    //emergency name 1
    worksheet.getCell('B48').value = '\u2612';
    //emergency relationship 1
    worksheet.getCell('J48').value = '\u2612';
    //emergency phone 1
    worksheet.getCell('B50').value = '\u2612';
    //emergency out? 1
    worksheet.getCell('K50').value = '\u2612';
    //emergency name 2
    worksheet.getCell('D55').value = '\u2612';
    //emergency relationship 2
    worksheet.getCell('J55').value = '\u2612';
    //emergency phone 2
    worksheet.getCell('D57').value = '\u2612';
    //emergency out? 2
    worksheet.getCell('K57').value = '\u2612';
    //* IDENTIFY QUESTION
    //female
    worksheet.getCell('A62').value = '\u2612';
    //genderqueer
    worksheet.getCell('A63').value = '\u2612';
    //intersex
    worksheet.getCell('A64').value = '\u2612';
    //male
    worksheet.getCell('A65').value = '\u2612';
    //transgerder
    worksheet.getCell('F62').value = '\u2612';
    //mtf
    worksheet.getCell('F63').value = '\u2612';
    //ftm
    worksheet.getCell('F64').value = '\u2612';
    //own words
    worksheet.getCell('F65').value = '\u2612';
    //OTHER text
    worksheet.getCell('G66').value = '\u2612';

    //* ORIENTATION
    //asexual
    worksheet.getCell('A70').value = '\u2612';
    //bisexual
    worksheet.getCell('A71').value = '\u2612';
    //gay
    worksheet.getCell('A72').value = '\u2612';
    //lesbian
    worksheet.getCell('A73').value = '\u2612';
    //pansexual
    worksheet.getCell('A74').value = '\u2612';
    //queer
    worksheet.getCell('F70').value = '\u2612';
    //questioning
    worksheet.getCell('F71').value = '\u2612';
    //straight
    worksheet.getCell('F72').value = '\u2612';
    //own words
    worksheet.getCell('F73').value = '\u2612';
    //OTHER text
    worksheet.getCell('G74').value = '\u2612';

    //* ETHNICITY
    // american indian
    worksheet.getCell('A78').value = '\u2612';
    //african
    worksheet.getCell('A79').value = '\u2612';
    //chinese
    worksheet.getCell('A80').value = '\u2612';
    //filipino
    worksheet.getCell('A81').value = '\u2612';
    // hispanic
    worksheet.getCell('A82').value = '\u2612';
    //own workds
    worksheet.getCell('A83').value = '\u2612';
    //japanese
    worksheet.getCell('G78').value = '\u2612';
    //korean
    worksheet.getCell('G79').value = '\u2612';
    //other asian
    worksheet.getCell('G80').value = '\u2612';
    // multi-racial
    worksheet.getCell('G81').value = '\u2612';
    // other pacific islander
    worksheet.getCell('G82').value = '\u2612';
    // south asian
    worksheet.getCell('K78').value = '\u2612';
    // vietnamese
    worksheet.getCell('K79').value = '\u2612';
    // white
    worksheet.getCell('K80').value = '\u2612';
    // OTHER text
    worksheet.getCell('J83').value = '\u2612';

    //english no
    worksheet.getCell('A86').value = '\u2612';
    //english yes
    worksheet.getCell('C86').value = '\u2612';

    //english home no
    worksheet.getCell('A89').value = '\u2612';
    //english home yes
    worksheet.getCell('C89').value = '\u2612';

    //health conditions
    worksheet.getCell('A94').value = '\u2612';

    //background
    worksheet.getCell('A100').value = '\u2612';

    //safe place to live yes
    worksheet.getCell('F104').value = '\u2612';
    //safe place to live no
    worksheet.getCell('H104').value = '\u2612';

    //homeless - YES
    worksheet.getCell('F017').value = '\u2612';
    //homeless - NO
    worksheet.getCell('H107').value = '\u2612';

    //food - yes
    worksheet.getCell('I109').value = '\u2612';
    //food - no
    worksheet.getCell('K109').value = '\u2612';

    //case manager - yes
    worksheet.getCell('XXX').value = '\u2612';
    //case manager - no
    worksheet.getCell('XXX').value = '\u2612';

    //school
    worksheet.getCell('XXX').value = '\u2612';
    //school
    worksheet.getCell('XXX').value = '\u2612';
    //which school
    worksheet.getCell('XXX').value = '\u2612';

    //citizenship
    worksheet.getCell('XXX').value = '\u2612';
    //foster care
    worksheet.getCell('XXX').value = '\u2612';
    //disability
    worksheet.getCell('XXX').value = '\u2612';
    //crime
    worksheet.getCell('XXX').value = '\u2612';
    //self-harm
    worksheet.getCell('XXX').value = '\u2612';
    //jailed
    worksheet.getCell('XXX').value = '\u2612';
    //substance
    worksheet.getCell('XXX').value = '\u2612';
    //military
    worksheet.getCell('XXX').value = '\u2612';
    //insurance
    worksheet.getCell('XXX').value = '\u2612';
    //cause to helen house
    worksheet.getCell('XXX').value = '\u2612';
    //lean of helen house
    worksheet.getCell('XXX').value = '\u2612';
    //first 1-5
    worksheet.getCell('XXX').value = '\u2612';
    //second 1-5
    worksheet.getCell('XXX').value = '\u2612';
    //who are you?
    worksheet.getCell('XXX').value = '\u2612';
    //comments 1
    worksheet.getCell('XXX').value = '\u2612';
    //staff
    worksheet.getCell('XXX').value = '\u2612';
    //intake data
    worksheet.getCell('XXX').value = '\u2612';
    //notes
    worksheet.getCell('XXX').value = '\u2612';



    worksheet.getCell('B65').value = '\u2612';



    // Save the filled Excel file
    await workbook.xlsx.writeFile('filled_file.xlsx');

    console.log('Filled Excel file generated successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

module.exports = generateFilledExcel;

// Call the async function
generateFilledExcel();

