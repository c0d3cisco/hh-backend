'use strict';

const { userAuth } = require('../../models');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { _authError(); }

    const token = req.headers.authorization.split(' ').pop();
    // TODO: WOULD NEED TO IMPORT GRAPHQL RESOLVE METHOD
    // I have a feeling this can be an independent authentication function?Í
    const validUser = await userAuth.authenticateToken(token);
    req.user = validUser;
    req.token = validUser.token;
    next();

  } catch (e) {
    _authError();
  }

  function _authError() {
    next('Invalid Login');
  }
};
