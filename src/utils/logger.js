const info = (message, metadata = {}) => {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  );
};

const error = (message, metadata = {}) => {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      ...metadata,
      timestamp: new Date().toISOString()
    })
  );
};

module.exports = {
  info,
  error
};
