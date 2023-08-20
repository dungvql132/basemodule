import express, { type Application } from "express";
import * as authController from "../controllers";

const app: Application = express();

app.post("/register/", authController.register);
app.post("/login/", authController.login);
app.post("/renewToken/", authController.renewAccessToken);
app.post("/checkUser/", authController.checkUserLogin);
app.post("/logout/", authController.logout);

export default app;
