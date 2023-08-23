import "reflect-metadata";
import "@src/base/config/i18n";
import bodyParser from "body-parser";
import cors from "cors";
import environment from "@src/base/config/env";
import authRoute from "@src/module/auth/routes";
import userManagerRoute from "@src/module/userManager/routes";
import express, { type Application } from "express";
import { handleError } from "./base/handleError/handleError";

const app: Application = express();
const port = environment.PORT;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// authentication
app.use(authRoute);
app.use(userManagerRoute);

// handle error
app.use(handleError);

app.listen(port, async () => {
  // await connection
  console.log(`listening on port ${port}!`);
});
