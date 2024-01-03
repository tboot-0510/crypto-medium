export const formatDateTime = (utcDateString) => {
  const utcDate = new Date(utcDateString);

  const options = {
    // year: "numeric",
    month: "short",
    day: "numeric",
  };

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
