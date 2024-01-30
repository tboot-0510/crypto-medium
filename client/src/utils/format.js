export const formatDateTime = (utcDateString, withYear = false) => {
  const utcDate = new Date(utcDateString);

  let options = {
    month: "short",
    day: "numeric",
  };

  if (withYear) {
    options.year = "numeric";
  }

  return new Intl.DateTimeFormat("en-US", options).format(utcDate);
};

export const generateIcon = (name) => {
  if (!name) return "";

  let displayName = name.slice(0, 1);
  if (name.length > 2) displayName = name.slice(0, 2);

  return displayName;
};

export const toUppercase = (string) => {
  if (!string) return;

  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const splitString = (string) => {
  if (!string) return;

  return string
    .split(",")
    .map((str) => str.trim())
    .filter((str) => str);
};

export const formatString = (string) => {
  if (!string) return;

  return (
    string.slice(0, 10) +
    "..." +
    string.slice(string.length - 10, string.length)
  );
};

const convertToGwei = (unit) => unit * 10 ** 18;

export const calculateMaticArticlePrice = (articlePrice, euroPrice) => {
  let euro2matic;
  try {
    euro2matic = 1 / euroPrice;
  } catch (err) {
    euro2matic = 1;
  }
  return convertToGwei(euro2matic * articlePrice);
};
