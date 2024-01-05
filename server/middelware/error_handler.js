export const errorWithStatusCode = (status, error, params) => {
  return {
    status,
    error_state: {
      message: error,
      params: params,
      details: {
        body: JSON.stringify(error).replace(/["']/g, ""),
      },
    },
  };
};
