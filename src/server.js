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
const { Op } = require('sequelize');
const { check } = require('yargs');

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

app.get('/countYouthByAge', async (req, res, next)=> {
  // const user = await userAuth.findAll({include: {model: userData}});
  const user = await users.findAll(checkin);
  res.status(200).send(user);
});

app.get('/UserWithCheckin/:id', async (req, res, next)=> {
  // const user = await userAuth.findAll({include: {model: userData}});
  const user = await userAuthModel.readWithAssociations(checkin, req.params.id);
  res.status(200).send(user);
});

app.get('/checkinquery', async (req, res, next)=> {
  let date = req.query.date;
  const checkins = await checkin.findAll({
    where:{
      timeIn: {
        [Op.gt]: new Date(`${date}T00:00:00.000Z`),
        [Op.lt]: new Date(`${date}T23:59:59.999Z`),
      },
    },
  });

  const userTimeDifference = {};
  checkins.forEach((checkin) => {
    const { userId, timeIn, timeOut } = checkin;
    if (!userTimeDifference[userId]) {
      userTimeDifference[userId] = 0;
    }
    console.log(userId);
    console.log(userTimeDifference);
    const differenceInMs = new Date(timeOut) - new Date(timeIn);
    userTimeDifference[userId] += differenceInMs;
  });
  const formattedTimeDifference = {};
  for (const userId in userTimeDifference) {
    const differenceInMs = userTimeDifference[userId];
    const hours = Math.floor(differenceInMs / (1000 * 60 * 60));
    const minutes = Math.floor((differenceInMs / (1000 * 60)) % 60);
    formattedTimeDifference[userId] = { hours, minutes };
  }
  res.status(200).send(formattedTimeDifference);
});


app.get('/checkinquery/:id', async (req, res, next)=> {
  let date = req.query.date;
  const checkins = await checkin.findAll({
    where:{
      userId: req.params.id,
      timeIn: {
        [Op.gt]: new Date(`${date}T00:00:00.000Z`),
        [Op.lt]: new Date(`${date}T23:59:59.999Z`),
      },
    },
  });


  res.status(200).send(checkins);
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
