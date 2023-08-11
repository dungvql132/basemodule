import express, { type Application } from "express";
import authRoute from "./auth.route";
import managerUser from "./managerUser.route";

const app: Application = express();

app.use("/", authRoute);
app.use("/", managerUser);

export default app;
