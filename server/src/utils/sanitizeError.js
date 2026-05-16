// Maps known Mongoose/driver error codes to safe user-facing messages.
// Falls back to a generic message in production so internal details never leak.
const sanitizeError = (err) => {
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map(e => e.message).join(', ');
    return msg;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  if (err.name === 'CastError') {
    return `Invalid value for ${err.path}`;
  }
  if (process.env.NODE_ENV === 'production') {
    return 'Something went wrong. Please try again.';
  }
  return err.message;
};

module.exports = sanitizeError;
