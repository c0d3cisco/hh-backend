'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');

const bearerAuth = require('./auth/middleware/bearer');
const acl = require('./auth/middleware/acl');

// Esoteric Resources
const notFoundHandler = require('./error-handlers/404.js');
const errorHandler = require('./error-handlers/500.js');
const authRoutes = require('./auth/routes.js');
const logger = require('./middleware/logger.js');
// TODO Update Routes
const Routes = require('./routes/index.js');
const { userAuthModel } = require('./models/index.js');
const { checkin, users } = require('./models/index.js');
const { Op } = require('sequelize');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

//auth0 code
const { checkJwt } = require('./auth/middleware/auth0');

// app.get('/checkUser', checkJwt, async (req, res, next) => {
//   // const user = await userAuth.findAll({include: {model: userData}});
//   try {
//     const user = await users.findAll({where: {username: req.body}});
//     res.status(200).send(user);
//   } catch (error) {
//     console.error(error.message || error);
//     res.status(500).send('error getting UserWithData');
//   }
// });
// Routes
// homebrew authenticator // need password
app.use(authRoutes);
app.use('/api', Routes);


// TODO Query Routes to be moved to the queries.js inside Route
// This gets all users that have userData inside the UserData Table
app.get('/UserWithData', checkJwt, async (req, res, next) => {
  // const user = await userAuth.findAll({include: {model: userData}});
  try {
    const user = await userAuthModel.readWithAssociations(users);
    res.status(200).send(user);
  } catch (error) {
    console.error(error.message || error);
    res.status(500).send('error getting UserWithData');
  }
});

// This gets all users that have checkIn data inside the CheckinData Table
app.get('/UserWithCheckin', checkJwt, async (req, res, next) => {
  // const user = await userAuth.findAll({include: {model: userData}});
  try {
    const user = await userAuthModel.readWithAssociations(checkin);
    res.status(200).send(user);
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting UserWithCheckin');
  }
});

// This gets a single user that has checkIn data inside the CheckinData Table, by ID
app.get('/UserWithCheckin/:id', checkJwt, async (req, res, next) => {
  // const user = await userAuth.findAll({include: {model: userData}});
  try {
    const user = await userAuthModel.readWithAssociations(checkin, req.params.id);
    res.status(200).send(user);
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting UserWithCheckin with ID');
  }
});

// This is our first checkin Query to find the total time all users spent during a single day at Helen House. You can also send a 2nd date to see the the range between the two dates Broken out by user

// Be sure to add in a query parameter for
// date_start YYYY-MM-DD
// and optional date_end YYYY-MM-DD
app.get('/checkinquery', checkJwt, async (req, res, next) => {

  try {
    let date_start = req.query.date_start;
    let date_end = req.query.date_end;
    const checkins = await checkin.findAll({
      where: {
        timeIn: {
          [Op.gt]: new Date(`${date_start}T00:00:00.000Z`),
          [Op.lt]: new Date(`${date_end ? date_end : date_start}T23:59:59.999Z`),
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
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting checkinquery');
  }
});

// This is our second checkin Query to find the total time a single user during a single day at Helen House. You can also send a 2nd date to see the the range between the two dates

// Be sure to add in /id to the end of the url
// Be sure to add in a query parameter for
// date_start YYYY-MM-DD
// and optional date_end YYYY-MM-DD
app.get('/checkinquery/:id', checkJwt, async (req, res, next) => {
  try {
    let date_start = req.query.date_start;
    let date_end = req.query.date_end;
    const checkins = await checkin.findAll({
      where: {
        userId: req.params.id,
        timeIn: {
          [Op.gt]: new Date(`${date_start}T00:00:00.000Z`),
          [Op.lt]: new Date(`${date_end ? date_end : date_start}T23:59:59.999Z`),
        },
      },
    });
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting checkinquery with ID');
  }
});

// This is our third checkin Query to find the average time all users spent during a single day at Helen House. Broken out by user

// Be sure to add in a query parameter for
// date_start YYYY-MM-DD
// and optional date_end YYYY-MM-DD
app.get('/checkinAverage', checkJwt, async (req, res, next) => {
  try {
    let date_start = req.query.date_start;
    let date_end = req.query.date_end;
    const checkins = await checkin.findAll({
      where: {
        timeIn: {
          [Op.gt]: new Date(`${date_start}T00:00:00.000Z`),
          [Op.lt]: new Date(`${date_end ? date_end : date_start}T23:59:59.999Z`),
        },
      },
    });

    const userTimeDifference = {};

    checkins.forEach((checkin) => {
      const { userId, timeIn, timeOut } = checkin;

      if (!userTimeDifference[userId]) {
        userTimeDifference[userId] = 0;
      }

      const differenceInMs = new Date(timeOut) - new Date(timeIn);
      userTimeDifference[userId] += differenceInMs;
    });

    let totalDifferenceInMs = 0;
    let numberOfUsers = 0;

    for (const userId in userTimeDifference) {
      const differenceInMs = userTimeDifference[userId];
      totalDifferenceInMs += differenceInMs;
      numberOfUsers++;
    }

    const averageTimePerUserInMs = totalDifferenceInMs / numberOfUsers;
    const averageTimePerUserInMinutes = averageTimePerUserInMs / (1000 * 60);
    const averageTimePerUserInHours = Math.floor(averageTimePerUserInMinutes / 60);
    const remainingMinutes = Math.floor(averageTimePerUserInMinutes % 60);

    res.status(200).json({ hours: averageTimePerUserInHours, minutes: remainingMinutes });
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting checkinAverage');
  }
});

// This is our fourth checkin Query to number of members below 13, between 13 and 18. over 18

app.get('/getAgeQuery', checkJwt, async (req, res, next)=> {
  try{
    const users13Under = await users.count({
      where:{
        date_of_birth: {
          [Op.gt]: new Date() - 410248800000,
        },
      },
    });
    const users13to18 = await users.count({
      where:{
        date_of_birth: {
          [Op.lt]: new Date() - 410248800000,
          [Op.gt]: new Date() - 568036800000,
        },
      },
    });

    const users18over = await users.count({
      where:{
        date_of_birth: {
          [Op.lt]: new Date() - 568036800000,
        },
      },
    });

    let allUsers = {
      users13Under,
      users13to18,
      users18over,
    };

    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting getAgeQuery');
  }
});

// proof of life
app.get('/', (req, res, next) => {
  res.status(200).send('Server is alive!!!');
});

// Catchalls
app.use('*', notFoundHandler);
app.use(errorHandler);

// Exports the app to other routes and starts the server.
module.exports = {
  app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};
