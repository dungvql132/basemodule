import express, { type Application } from "express";
import * as dailyDiaryController from "../controllers/dailyDiary.controller";

const app: Application = express();

// 📌 Các route cho Diary
app.get("/", dailyDiaryController.getAll);          // Lấy tất cả nhật ký
app.get("/:id", dailyDiaryController.getOne);      // Lấy một nhật ký theo ID
app.post("", dailyDiaryController.create);    // Tạo mới nhật ký
app.put("/:id", dailyDiaryController.update); // Cập nhật nhật ký theo ID
app.delete("/:id", dailyDiaryController.remove); // Xóa nhật ký theo ID

export default app;
