import { DailyDiary, Diary } from "@prisma/client";

export interface IDiary extends Diary {
  dailyDiaries?: DailyDiary[];  // Thêm thông tin về DailyDiaries dưới dạng DTO nếu cần
}