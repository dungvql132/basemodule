import express, { type Application } from "express";
import managerUser from "./managerUser.route";

const app: Application = express();

app.use("/", managerUser);

export default app;
