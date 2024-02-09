const processWithError = (func) => async (req, res, next) => {
  try {
    res.json(await func(req, res));
  } catch (e) {
    console.log("ProcessWithError", e);

    // res.status(e.status || 500).json({
    //   error: "Error occurred",
    //   message: e.error_state?.message || "Internal Server Error",
    //   details: e.error_state?.details || "An unexpected error occurred",
    // });
    next(e);
  }
};

export { processWithError };
