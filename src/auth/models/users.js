'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET || 'secretstring';

const userModel = (sequelize, DataTypes) => {
  // Define the 'users' model
  const model = sequelize.define('users', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('user', 'staff', 'admin'), allowNull: false, defaultValue: 'user'},
    token: {
      // Virtual field for generating and storing JWT token
      type: DataTypes.VIRTUAL,
      get() {
        // Generate a JWT token containing the username
        return jwt.sign({ username: this.username }, SECRET);
      },
      set(tokenObj) {
        // Setter function for the token field
        let token = jwt.sign(tokenObj, SECRET);
        return token;
      },
    },
    capabilities: {
      // Virtual field for defining user capabilities based on their role
      type: DataTypes.VIRTUAL,
      get() {
        const acl = {
          user: ['create', 'update'],
          staff: ['read', 'create', 'update'],
          admin: ['read', 'create', 'update', 'delete'],
        };
        // Return the capabilities based on the user's role
        return acl[this.role];
      },
    },
  });

  // Before creating a user, hash the password
  model.beforeCreate(async (user) => {
    let hashedPass = await bcrypt.hash(user.password, 10);
    user.password = hashedPass;
  });

  // Static method for authenticating a user with basic authentication
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }
    throw new Error('Invalid User');
  };

  // Static method for authenticating a user with a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({ where: { username: parsedToken.username } });
      if (user) {
        return user;
      }
      throw new Error('User Not Found');
    } catch (e) {
      throw new Error(e.message);
    }
  };

  return model;
};

module.exports = userModel;

