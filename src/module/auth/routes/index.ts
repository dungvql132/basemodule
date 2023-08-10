import express, { type Application } from "express";
import authRoute from "./auth.route";

const app: Application = express();

app.use("/", authRoute);

export default app;
