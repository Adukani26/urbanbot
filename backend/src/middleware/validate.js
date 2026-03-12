export const validate = (body, requiredFields) => {
  const missing = requiredFields.filter(field => {
    return body[field] === undefined || body[field] === null || body[field] === '';
  });

  if (missing.length > 0) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
};