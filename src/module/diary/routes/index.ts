import express, { type Application } from "express";
import diaryRoute from "./diary.route";
import dailyDiaryRoute from "./dailyDiary.route";
import eventRoute from "./event.route";

const app: Application = express();

app.use("/diary", diaryRoute);
app.use("/daily-diary", dailyDiaryRoute);
app.use("/event", eventRoute);

export default app;
