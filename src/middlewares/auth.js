const jwt = require('jsonwebtoken');

const setUser = (req, res, next) => {
  const authHeader = req.get('authorization');

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, 'JWT_SECRET', (error, user) => {
      if (error) {
        res.status(401);
        next(new Error('Token invalido, No Autorizado.'));
      }
      req.user = user;
      next();
    });
  } else {
    next();
  }
};

module.exports = setUser;
