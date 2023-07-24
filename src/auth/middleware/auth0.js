const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://helen-house-backend-v3uq.onrender.com',
  issuerBaseURL: `https://dev-3c6lxg8hjpdu1ria.us.auth0.com/`,
});

module.exports = checkJwt;
