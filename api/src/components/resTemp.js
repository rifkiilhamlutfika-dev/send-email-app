const response = (res, statusCode = 200, data = {}, message) => {
  res.status(statusCode).json({ data, message });
};

module.exports = { response };
