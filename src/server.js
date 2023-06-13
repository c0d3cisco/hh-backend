'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');


// Esoteric Resources
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes.js');
const logger = require('./middleware/logger.js');
// TODO Update Routes
const Routes = require('./routes/index.js');
const { userAuth, userAuthModel, userData } = require('./models/index.js');
const{ checkin, users } = require('./models/index.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger);

// Routes
app.use(authRoutes);
app.use('/api', Routes);

app.get('/UserWithData', async (req, res, next)=> {
  // const user = await userAuth.findAll({include: {model: userData}});
  const user = await userAuthModel.readWithAssociations(users);
  res.status(200).send(user);
});

app.get('/UserWithCheckin', async (req, res, next)=> {
  // const user = await userAuth.findAll({include: {model: userData}});
  const user = await userAuthModel.readWithAssociations(checkin);
  res.status(200).send(user);
});


// proof of life
app.get('/', (req, res, next) => {
  res.status(200).send('Server is alive!!!');
});


// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

module.exports = {
  app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
