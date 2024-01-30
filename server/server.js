import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import isAuthenticated from "./middelware/authentication.js";

import corsOptions from "./config/corsOptions.js";
import authRouter from "./routes/auth.js";
import feedRouter from "./routes/feed.js";
import tokenRouter from "./routes/token.js";
import tagRouter from "./routes/tag.js";
import userRouter from "./routes/user.js";
import transactionRouter from "./routes/transaction.js";
import postRouter from "./routes/post.js";

import blockchainListenerQueue from "./jobs/queue/blockchain_listener_queue.js";
import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullAdapter } from "@bull-board/api/bullAdapter.js";
import tags from "./constants/tags.js";
import Tag from "./models/tag.js";

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [new BullAdapter(blockchainListenerQueue)],
  serverAdapter: serverAdapter,
});

const uri = process.env.MONGODB_URI;

const app = express();
const PORT = 5000;
const httpServer = createServer(app);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

connect(uri)
  .then(async () => {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    httpServer.listen({ port: PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/`);
      const formattedTags = tags.map((tag) => ({ name: tag }));
      Tag.findOne(formattedTags[0]).then((resp) => {
        if (!resp) {
          Tag.collection.insertMany(formattedTags);
          return;
        }
      });
    });
  })
  .catch((err) => console.error(err));

app.use("/admin/queues", serverAdapter.getRouter());
app.use("/auth", authRouter);
app.use("/feed", isAuthenticated, feedRouter);
app.use("/post", postRouter);
app.use("/token", tokenRouter);
app.use("/user", userRouter);
app.use("/transaction", transactionRouter);
app.use("/tags", tagRouter);

// blockchainListenerQueue.on("progress", ({ jobId, data }, timestamp) => {
//   console.log(`${jobId} reported progress ${data} at ${timestamp}`);
// });

// blockchainListenerQueue.on("waiting", ({ jobId }) => {
//   console.log(`A job with ID ${jobId} is waiting`);
// });

// blockchainListenerQueue.on("active", ({ jobId, prev }) => {
//   console.log(`Job ${jobId} is now active; previous status was ${prev}`);
// });

// blockchainListenerQueue.on("completed", ({ jobId, returnvalue }) => {
//   console.log(`${jobId} has completed and returned ${returnvalue}`);
// });

// blockchainListenerQueue.on("failed", ({ jobId, failedReason }) => {
//   console.log(`${jobId} has failed with reason ${failedReason}`);
// });
