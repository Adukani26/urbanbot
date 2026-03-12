export const errorHandler = (error, request, reply) => {
  const statusCode = error.statusCode || 500;
  const message    = error.message    || 'Internal Server Error';

  request.log.error({
    statusCode,
    message,
    stack:  error.stack,
    url:    request.url,
    method: request.method,
  });

  reply.status(statusCode).send({
    error:      true,
    message,
    statusCode,
  });
};