export const formatDateTime = (utcDateString) => {
  const utcDate = new Date(utcDateString);

  const options = {
    // year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(utcDate);
};

export const toUppercase = (string) => {
  if (!string) return;

  return string.charAt(0).toUpperCase() + string.slice(1);
};
