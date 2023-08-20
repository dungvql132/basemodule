import express, { type Application } from "express";
import * as authController from "../controllers";
import { authenticationMiddleware } from "@src/module/auth/middlewares/authentication";

const app: Application = express();

app.put("/user/:id", authenticationMiddleware, authController.updateUser);
app.delete("/user/:id", authenticationMiddleware, authController.deleteUser);
app.put(
  "/reactiveUser/:id",
  authenticationMiddleware,
  authController.reactiveUser
);

export default app;
