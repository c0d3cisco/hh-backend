'use strict';

// 3rd party resources
const express = require('express');
const authRouter = express.Router();

// Authentication
const { userAuth } = require('../models');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');
const permissions = require('./middleware/acl');
// Sign up route
authRouter.post('/signup', async (req, res, next) => {
  try {
    // Create a new user record
    let userRecord = await userAuth.create(req.body);
    const output = {
      user: userRecord,
      token: userRecord.token,
    };
    res.status(201).json(output);
  } catch (e) {
    next(e.message);
  }
});

// Sign in route
authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token,
  };
  res.status(200).json(user);
});

// Get all users route
authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res, next) => {
// Find all user records
  const userRecords = await userAuth.findAll({});
  // Extract usernames from user records
  const list = userRecords.map(user => user.username);
  res.status(200).json(list);
});

// Secret route (requires bearer authentication)
authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send('Welcome to the secret area');
});

module.exports = authRouter;
