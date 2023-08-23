import * as authController from "../controllers";
import express, { type Application } from "express";
import { authenticationMiddleware } from "@src/middlewares/authentication";

const app: Application = express();

app.put("/user/:id", authenticationMiddleware, authController.updateUser);
app.delete("/user/:id", authenticationMiddleware, authController.deleteUser);
app.put(
  "/reactiveUser/:id",
  authenticationMiddleware,
  authController.reactiveUser
);

export default app;
