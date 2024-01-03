import allowedOrigins from "./allowedOrigin.js";

const corsOptions = {
  origin: (origin, callback) => {
    // !origin only for dev
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
