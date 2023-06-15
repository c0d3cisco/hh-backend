'use strict';

//Evnvironmental variables
require('dotenv').config();
const app = require('./src/server.js');
const { db } = require('./src/models');
const PORT = process.env.PORT || 3001;

db.sync().then(() => {
  app.start(PORT || 3001);
});

// ! This function clears your local DB
async function initializeDatabase() {
  try {
    // Synchronize the Regions model with the database table
    await db.sync({ force: true });
    console.log('All models were synchronized successfully');
  } catch (error) {
    console.error('Error occurred while syncing all models.', error);
  }
}

//! type 'clear all' into the terminal to clear the database

process.stdin.on('data', data => {

  if(data.toString().slice(0, -1) === 'clear all'){
    console.log('clearing ALL table');
    initializeDatabase();
  }
});
