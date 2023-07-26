'use strict';

// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
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
const { checkin, users, userAuth } = require('./models/index.js');

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

//auth0 code
const { checkJwt } = require('./auth/middleware/auth0');

app.post('/checkUser', async (req, res, next) => {

  try {
    console.log('TEST pass', req.body);
    const user = await userAuth.findAll( {where: { username: req.body.username } });
    res.status(200).send(user);

  } catch (error) {
    console.log('TEST fail', req.body);
    console.error(error.message || error);
    res.status(500).send('error getting user');
  }

});
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
        timeOut: {
          [Op.not]: null,
        },
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

// This is our update checkin Query to update the checkin with the timeOut

app.put('/checkinUpdate/:id', checkJwt, async (req, res, next) => {
  try {
    const checkins = await checkin.findOne({
      where: {
        id: req.params.id,
        // moodOut: null,
      },
    });
    const updatedCheckin = await checkins.update(req.body);
    console.log(req.body);
    res.status(200).send(updatedCheckin);
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting checkin with ID');
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
        timeOut: {
          [Op.not]: null,
        },
        timeIn: {
          [Op.gt]: new Date(`${date_start}T00:00:00.000Z`),
          [Op.lt]: new Date(`${date_end ? date_end : date_start}T23:59:59.999Z`),
        },
      },
    });
    res.status(200).send(checkins);
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
        timeOut: {
          [Op.not]: null,
        },
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

// Query for Dashboard: Total Daily Check-ins (# of unique users)

app.get('/totalDailyCheckins', checkJwt, async (req, res, next) => {
  try {
    let date_start = req.query.date_start;
    let date_end = req.query.date_end;
    const checkinCount = await checkin.count({
      distinct: true,
      col: 'userId',
      where: {
        timeOut: {
          [Op.not]: null,
        },
        timeIn: {
          [Op.gt]: new Date(`${date_start}T00:00:00.000Z`),
          [Op.lt]: new Date(`${date_end ? date_end : date_start}T23:59:59.999Z`),
        },
      },
    });

    res.status(200).send({uniqueCheckinUsers: checkinCount});
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting unique user checkin count');
  }
});

// Query for Dashboard: Weekly Average Check-ins
app.get('/weeklyAverage', checkJwt, async (req, res, next) => {
  try {
    let date_start = req.query.date_start;

    // parse date string into Date object
    let start = new Date(date_start);
    let end = new Date(); // set the end date to the current date/time

    // adjust start date to the most recent Monday
    start.setDate(start.getDate() - start.getDay() + 1);

    // create an array to store the results for each week
    let weeklyAverages = [];

    // iterate over weeks
    for (let weekStart = start; weekStart < end; weekStart.setDate(weekStart.getDate() + 7)) {
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const checkins = await checkin.findAll({
        where: {
          timeOut: {
            [Op.not]: null,
          },
          timeIn: {
            [Op.gte]: weekStart,
            [Op.lte]: weekEnd,
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

      let averageTimePerUserInHours = 0;
      let remainingMinutes = 0;

      if (numberOfUsers > 0) {
        const averageTimePerUserInMs = totalDifferenceInMs / numberOfUsers;
        const averageTimePerUserInMinutes = averageTimePerUserInMs / (1000 * 60);
        averageTimePerUserInHours = Math.floor(averageTimePerUserInMinutes / 60);
        remainingMinutes = Math.floor(averageTimePerUserInMinutes % 60);
      }

      console.log(`Week starting ${weekStart}: Average check-in time is ${averageTimePerUserInHours} hours and ${remainingMinutes} minutes`);

      // add the results for this week to the array
      weeklyAverages.push({
        weekStart: weekStart.toISOString(),
        averageTimeInHours: averageTimePerUserInHours,
        averageTimeInMinutes: remainingMinutes
      });
    }

    // send the results array back to the client
    res.status(200).send(weeklyAverages);

  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting weeklyAverage');
  }
});



// Query for Dashboard: YTD Check-ins
app.get('/totalYearlyCheckins', checkJwt, async (req, res, next) => {
  try {
    let start = new Date(new Date().getFullYear(), 0, 1); // Start of the year
    let end = new Date(); // Today's date

    const checkinCount = await checkin.count({
      where: {
        timeOut: {
          [Op.not]: null,
        },
        timeIn: {
          [Op.gte]: start,
          [Op.lte]: end,
        },
      },
    });

    res.status(200).send({totalCheckinsYearToDate: checkinCount});
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting total checkin count for the year');
  }
});

// Query for Dashboard: Total Hours
app.get('/totalCheckinHours', checkJwt, async (req, res, next) => {
  try {
    const checkins = await checkin.findAll({
      where: {
        timeOut: {
          [Op.not]: null,
        },
      },
    });

    let totalHours = 0;

    checkins.forEach((checkin) => {
      const { timeIn, timeOut } = checkin;
      const differenceInMs = new Date(timeOut) - new Date(timeIn);
      const differenceInHours = differenceInMs / (1000 * 60 * 60);
      totalHours += differenceInHours;
    });

    res.status(200).send({ totalHours: totalHours });
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting total checkin hours');
  }
});


// Query for Dashboard Chart: Total Hours for Check-ins by day
app.get('/totalHoursPerWeek', checkJwt, async (req, res, next) => {
  try {
    let date_end = new Date();
    let date_start = new Date();
    date_start.setDate(date_end.getDate() - 7); // Adjust this value to change the time span

    const checkins = await checkin.findAll({
      where: {
        timeOut: {
          [Op.not]: null,
        },
        timeIn: {
          [Op.gte]: date_start,
          [Op.lte]: date_end,
        },
      },
    });

    let totalDifferenceInMs = 0;

    checkins.forEach((checkin) => {
      const { timeIn, timeOut } = checkin;
      const differenceInMs = new Date(timeOut) - new Date(timeIn);
      totalDifferenceInMs += differenceInMs;
    });

    const totalDifferenceInHours = totalDifferenceInMs / (1000 * 60 * 60);

    res.status(200).send({totalHours: totalDifferenceInHours});

  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting totalHoursPerWeek');
  }
});



// Query for Dashboard Chart: Total Number of Unique Check-ins by day
app.get('/uniqueUsersPerWeek', checkJwt, async (req, res, next) => {
  try {
    let date_end = new Date();
    let date_start = new Date();
    date_start.setDate(date_end.getDate() - 7); // Adjust this value to change the time span

    const checkinCount = await checkin.count({
      distinct: true,
      col: 'userId',
      where: {
        timeOut: {
          [Op.not]: null,
        },
        timeIn: {
          [Op.gte]: date_start,
          [Op.lte]: date_end,
        },
      },
    });

    res.status(200).send({uniqueCheckinUsers: checkinCount});
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('error getting uniqueUsersPerWeek');
  }
});



// Query for Pie Chart: Total Hours A Member was Checked In on a Given Day (Compare to total hours of operations on a given day)
app.get('/totalActiveTime', checkJwt, async (req, res, next) => {
  try {
    const date = req.query.date;

    const earliestCheckIn = await checkin.findOne({
      where: {
        timeIn: {
          [Op.gte]: new Date(`${date}T00:00:00.000Z`),
          [Op.lte]: new Date(`${date}T23:59:59.999Z`),
        },
      },
      order: [
        ['timeIn', 'ASC']
      ],
    });

    const latestCheckOut = await checkin.findOne({
      where: {
        timeOut: {
          [Op.gte]: new Date(`${date}T00:00:00.000Z`),
          [Op.lte]: new Date(`${date}T23:59:59.999Z`),
        },
      },
      order: [
        ['timeOut', 'DESC']
      ],
    });

    if (!earliestCheckIn || !latestCheckOut) {
      res.status(200).send({activeHours: 0});
      return;
    }

    const timeDifferenceInMs = new Date(latestCheckOut.timeOut) - new Date(earliestCheckIn.timeIn);
    const timeDifferenceInHours = timeDifferenceInMs / (1000 * 60 * 60);

    res.status(200).send({activeHours: timeDifferenceInHours});
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting total active hours');
  }
});

// Query for Dashboard: Average moodIn for a given day
app.get('/averageMoodIn', checkJwt, async (req, res, next) => {
  try {
    let date = req.query.date;
    let moodMapping = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5};  // Map ENUM to integer

    const moodInData = await checkin.findAll({
      attributes: ['moodIn'],
      where: {
        timeIn: {
          [Op.between]: [new Date(`${date}T00:00:00.000Z`), new Date(`${date}T23:59:59.999Z`)],
        },
      },
    });

    // Map the fetched ENUMs to integers and calculate the average
    let sumMoodIn = 0;
    for (let moodInObj of moodInData) {
      sumMoodIn += moodMapping[moodInObj.moodIn];
    }
    let avgMoodIn = sumMoodIn / moodInData.length;

    res.status(200).send({ averageMoodIn: avgMoodIn });
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting average moodIn for a day');
  }
});



// Query for Dashboard: Average moodOut for a given day
app.get('/averageMoodOut', checkJwt, async (req, res, next) => {
  try {
    let date = req.query.date;
    let moodMapping = {'1': 1, '2': 2, '3': 3, '4': 4, '5': 5};  // Map ENUM to integer

    const moodOutData = await checkin.findAll({
      attributes: ['moodOut'],
      where: {
        timeOut: {
          [Op.between]: [new Date(`${date}T00:00:00.000Z`), new Date(`${date}T23:59:59.999Z`)],
        },
      },
    });

    // Map the fetched ENUMs to integers and calculate the average
    let sumMoodOut = 0;
    for (let moodOutObj of moodOutData) {
      if (moodOutObj.moodOut !== null) {
        sumMoodOut += moodMapping[moodOutObj.moodOut];
      }
    }
    let avgMoodOut = sumMoodOut / moodOutData.length;

    res.status(200).send({ averageMoodOut: avgMoodOut });
  } catch (error) {
    console.log(error.message || error);
    res.status(500).send('Error getting average moodOut for a day');
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
