'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./userData/model.js');
const checkinModel = require('./checkin/model.js');
const userAuthModel = require('../auth/models/users.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL);
const checkin = checkinModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  checkinData: new Collection(checkin),
  userData: new Collection(users),
  userAuth: userAuthModel(sequelize, DataTypes),
};
