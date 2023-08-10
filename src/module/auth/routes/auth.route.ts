import express, { type Application } from "express";
import authController from "../controllers";

const app: Application = express();

app.post("/register/", authController.register);

export default app;
