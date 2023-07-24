'use strict';

//Imports
const { Sequelize, DataTypes } = require('sequelize');
const pg = require('pg');
const userModel = require('./userData/model.js');

const userModelSaved = require('./userData/model-secure.js');
const userModelTemp = require('./userData/model-basic.js');
const checkinModel = require('./checkin/model.js');
const userAuthModel = require('../auth/models/users.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite::memory:';

// Create a new Sequelize instance and connect to the database
const sequelize = new Sequelize(DATABASE_URL);

// Define the checkin model using the checkinModel function
const checkin = checkinModel(sequelize, DataTypes);

// Define the users model using the userModel function
const users = userModel(sequelize, DataTypes);

//! THESE ARE THE NEW WRAPPED MODELS WITH SEQUELIZE HOOKS ONLY
const userDataSaved = userModelSaved(sequelize, DataTypes);

const userDataTemp = userModelTemp(sequelize, DataTypes);

// Define the userAuth model using the userAuthModel function
const userAuth = userAuthModel(sequelize, DataTypes);

// Define associations between models
userAuth.hasMany(checkin, { foreignKey: 'userId' });
checkin.belongsTo(userAuth);

userAuth.hasMany(users, { foreignKey: 'userId' });

users.belongsTo(userAuth);

// Export the Sequelize instance, models, and data collections
module.exports = {
  db: sequelize, // Sequelize instance
  checkin, // Checkin model
  checkinData: new Collection(checkin), // Data collection for checkin model
  users, // Users model
  userData: new Collection(users), // Data collection for users model
  userAuth, // UserAuth model
  userAuthModel: new Collection(userAuth), // Data collection for userAuth model


};
