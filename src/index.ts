import "reflect-metadata";
import express, { type Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRoute from "@src/module/auth/routes";

import dotenv from "dotenv";
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 1302;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// authentication
app.use(authRoute);

app.listen(port, async () => {
  // await connection
  console.log(`listening on port ${port}!`);
});
