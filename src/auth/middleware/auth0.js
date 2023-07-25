const { auth, claimCheck, InsufficientScopeError } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
  audience: 'https://helen-house-backend-v3uq.onrender.com',
  issuerBaseURL: `https://dev-3c6lxg8hjpdu1ria.us.auth0.com/`,
});

const checkRequiredPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];

      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission),
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};

module.exports = {
  checkJwt,
  checkRequiredPermissions,
};
