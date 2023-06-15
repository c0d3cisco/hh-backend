'use strict';

const checkinModel = (sequelize, DataTypes) => sequelize.define('checkin', {
  userId: {type: DataTypes.INTEGER, allowNull: false},
  // username: { type: DataTypes.STRING, allowNull: false },
  timeIn: { type: DataTypes.DATE, allowNull: false },
  timeOut: { type: DataTypes.DATE, allowNull: true },
  moodIn: { type: DataTypes.ENUM(['1 - Terrible', '2', '3', '4', '5 - Excellent']), allowNull: false},
  moodOut: { type: DataTypes.ENUM(['1 - Terrible', '2', '3', '4', '5 - Excellent']), allowNull: true},

});

module.exports = checkinModel;

