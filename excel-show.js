const ExcelJS = require('exceljs');

async function generateFilledExcel(data=null, checkin=null) {

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('template_show.xlsx');

    // Get the worksheet you want to fill
    const worksheet = workbook.getWorksheet('UserData');
    const worksheet2 = workbook.getWorksheet('CheckIn');

    if(data){
    // Load the existing template

      // Modify the cells with your data
      let cellNumber = 1;
      data.forEach((user) => {
        worksheet.getCell(`A${cellNumber}`).value = '*************';
        worksheet.getCell(`B${cellNumber}`).value = '*************';
        for (const [key, value] of Object.entries(user)) {
          console.log(`${key}: ${value}`);
          worksheet.getCell(`A${cellNumber}`).value = key;
          worksheet.getCell(`B${cellNumber}`).value = value;
          cellNumber++;
          // console.log(cellNumber);
        }
      });
    }

    if(checkin){

      // Modify the cells with your data
      let cellNumber = 1;
      checkin.forEach((user) => {
        worksheet2.getCell(`A${cellNumber}`).value = '*************';
        worksheet2.getCell(`B${cellNumber}`).value = '*************';
        for (const [key, value] of Object.entries(user)) {
          console.log(`${key}: ${value}`);
          worksheet2.getCell(`A${cellNumber}`).value = key;
          worksheet2.getCell(`B${cellNumber}`).value = value;
          cellNumber++;
          // console.log(cellNumber);
        }
      });
    }

    // Save the filled Excel file
    await workbook.xlsx.writeFile('filled_file.xlsx');


    console.log('Filled Excel file generated successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the async function


async function fetchData() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNpc2NvQWRtaW4iLCJpYXQiOjE2ODY5NDAyNzN9.3r3h-Zpszm5JKKxhYCscTOk1LR6v_k4URUjqwEz5qsk';

  try {
    const response = await fetch('https://helen-house-backend.onrender.com/api/userData', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Request failed with status ' + response.status);
    }

    const data = await response.json();

    const responseCheckin = await fetch('https://helen-house-backend.onrender.com/api/checkinData', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!responseCheckin.ok) {
      throw new Error('Request failed with status ' + responseCheckin.status);
    }

    const dataCheckin = await responseCheckin.json();
    // Process the retrieved data
    generateFilledExcel(data, dataCheckin);
    console.log(data);
  } catch (error) {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
  }
}

fetchData();


