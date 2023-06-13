'use strict';

const checkinModel = (sequelize, DataTypes) => sequelize.define('checkin', {
  username: { type: DataTypes.STRING, required: true },
  timeIn: { type: DataTypes.DATE, required: true },
  timeOut: { type: DataTypes.DATE, required: false },
  moodIn: { type: DataTypes.ENUM(['1 - Terrible', '2', '3', '4', '5 - Excellent']), required: true},
  moodOut: { type: DataTypes.ENUM(['1 - Terrible', '2', '3', '4', '5 - Excellent']), required: false},
});

module.exports = checkinModel;

