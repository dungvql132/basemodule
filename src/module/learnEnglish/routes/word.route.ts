import express, { type Application } from "express";
import * as wordController from "../controllers";
import { authenticationMiddleware } from "@src/module/auth/middlewares/authentication";

const app: Application = express();

app.post("/word/", authenticationMiddleware, wordController.createWord);
app.get("/word/", authenticationMiddleware, wordController.getAllWord);
app.get("/word/:id", authenticationMiddleware, wordController.getWordById);
app.put("/word/:id", authenticationMiddleware, wordController.updateWordById);

export default app;
