import express, { type Application } from "express";
import * as eventController from "../controllers/event.controller";

const app: Application = express();

// 📌 Các route cho Diary
app.get("/", eventController.getAll);          // Lấy tất cả nhật ký
app.get("/:id", eventController.getOne);      // Lấy một nhật ký theo ID
app.post("", eventController.create);    // Tạo mới nhật ký
app.put("/:id", eventController.update); // Cập nhật nhật ký theo ID
app.delete("/:id", eventController.remove); // Xóa nhật ký theo ID

export default app;
