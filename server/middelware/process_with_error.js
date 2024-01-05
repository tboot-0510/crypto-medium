const processWithError = (func) => async (req, res, next) => {
  try {
    res.json(await func(req, res));
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export { processWithError };
