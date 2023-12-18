import express from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import authRouter from "./routes/auth.js";
import { createServer } from "http";
import { connect } from "mongoose";

const uri =
  "mongodb+srv://bootthom:GBzqcKmOxwnOGrsT@cluster0.mrfymag.mongodb.net/medium?retryWrites=true&w=majority&ssl=true";

const app = express();
const PORT = 5000;
const httpServer = createServer(app);

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

connect(uri)
  .then(async () => {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.error(err));

app.use("/auth", authRouter);
