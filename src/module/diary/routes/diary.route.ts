import express, { type Application } from "express";
import * as diaryController from "../controllers/diary.controller";

const app: Application = express();

// 📌 Các route cho Diary
app.get("/", diaryController.getAll);          // Lấy tất cả nhật ký
app.get("/:id", diaryController.getOne);      // Lấy một nhật ký theo ID
app.post("", diaryController.createDiary);    // Tạo mới nhật ký
app.put("/:id", diaryController.updateDiary); // Cập nhật nhật ký theo ID
app.delete("/:id", diaryController.deleteDiary); // Xóa nhật ký theo ID

export default app;
