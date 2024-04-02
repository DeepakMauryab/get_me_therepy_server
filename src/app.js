import express from "express";
import cors from "cors";
const app = express();

import userRouter from "./router/userRouter.js";
import evnetRouter from "./router/eventRouter.js";

app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.get("", (req, res) => {
  res.send({ message: "hello get me therepy" });
});

app.use("/api/v1/customer", userRouter);
app.use("/api/v1/event", evnetRouter);

app.use((req, res, next) => {
  next(res.status(404).json({ error: "Invalid Route" }));
});

export default app;
