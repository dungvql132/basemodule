import express, { type Application } from "express";
import authController from "../controllers";

const app: Application = express();

app.put("/user/:id", authController.updateUser);
app.delete("/user/:id", authController.deleteUser);

export default app;
