import express, { type Application } from "express";
import wordRoute from "./word.route";

const app: Application = express();

app.use("/", wordRoute);

export default app;
