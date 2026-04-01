const { ROLES, RECORD_TYPES } = require("./constants");

const isNonEmptyString = (value) => {
  return typeof value === "string" && value.trim().length > 0;
};

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidRole = (value) => {
  return Object.values(ROLES).includes(value);
};

const isPositiveNumber = (value) => {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
};

const isValidRecordType = (value) => {
  return Object.values(RECORD_TYPES).includes(value);
};

const isValidDateValue = (value) => {
  return !Number.isNaN(new Date(value).getTime());
};

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidRole,
  isPositiveNumber,
  isValidRecordType,
  isValidDateValue
};
