import express, { type Application } from "express";
import * as authController from "../controllers";

const app: Application = express();

app.put("/user/:id", authController.updateUser);
app.delete("/user/:id", authController.deleteUser);
app.put("/reactiveUser/:id", authController.reactiveUser);

export default app;
