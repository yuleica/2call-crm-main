const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`La ruta no fue encontrada => ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  // console.log(error.name);
  if (error.name === 'CastError') {
    return res.status(400).send({
      error: 'Formato de ID invalido.',
      stack: error.stack,
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: error.message,
      stack: error.stack,
    });
  }

  return res.status(res.statusCode).json({
    error: error.message,
    stack: error.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
