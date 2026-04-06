const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);
  const needsEscaping = /[",\n\r]/.test(stringValue);

  if (!needsEscaping) {
    return stringValue;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const toCsv = (rows, headers) => {
  const headerRow = headers.join(",");
  const dataRows = rows.map((row) => {
    return headers.map((header) => escapeCsvValue(row[header])).join(",");
  });

  return [headerRow, ...dataRows].join("\n");
};

module.exports = {
  toCsv
};
