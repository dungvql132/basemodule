import * as authController from "../controllers";
import express, { type Application } from "express";

const app: Application = express();

app.post("/register/", authController.register);
app.post("/login/", authController.login);
app.post("/renewToken/", authController.renewAccessToken);
app.post("/checkUser/", authController.checkUserLogin);
app.post("/logout/", authController.logout);

export default app;
