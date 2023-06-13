'use strict';

require('dotenv').config();
const app = require('./src/server.js');
const { db } = require('./src/models');
const PORT = process.env.PORT || 3001;


db.sync().then(() => {
  app.start(PORT || 3001);
});

// !Remove this before deploying
async function initializeDatabase() {
  try {
    // Synchronize the Regions model with the database table
    await db.sync({ force: true });
    console.log('All models were synchronized successfully');
  } catch (error) {
    console.error('Error occurred while syncing all models.', error);
  }
}
// Comment this in when you want to clear the DB, all of it
// initializeDatabase();
