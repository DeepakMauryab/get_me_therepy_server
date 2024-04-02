import dotenv from "dotenv";
import dataBaseConnection from "./database/connect.js";
import app from "./app.js";

dotenv.config({
  path: "./config.env",
});

dataBaseConnection();

app.listen(process.env.PORT, () => {
  console.log(`connected at  : http://localhost:${process.env.PORT}`);
});
