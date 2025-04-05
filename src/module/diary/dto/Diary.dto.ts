import { Type } from "class-transformer";
import { IsString, IsDateString, IsInt, IsOptional } from "class-validator";
import { DailyDiaryDto } from "./DailyDiary.dto"; // Import DTO của DailyDiary
import { DailyDiary, Diary } from "@prisma/client";
import { IDiary } from "../interface/IDiary";

export class DiaryDto {
  @IsInt()
  id: number;

  @IsInt()
  userId: number;

  @IsString()
  name: string;

  @IsDateString()
  createDate: Date;

  @IsDateString()
  updateDate: Date;

  @Type(() => DailyDiaryDto)
  dailyDiaries: DailyDiaryDto[];  // Lưu ý thêm DailyDiaryDTO

  constructor(diary: Diary & { dailyDiaries?: DailyDiary[] }) {
    if (diary) {
        this.id = diary.id ? diary.id : -1;
        this.userId = diary.userId;
        this.name = diary.name;
        this.createDate = diary.createDate;
        this.updateDate = diary.updateDate;
        this.dailyDiaries = diary.dailyDiaries ? diary.dailyDiaries.map((dd) => new DailyDiaryDto(dd)) : [];
    }
  }
}


export class CreateDiaryDto {

    @IsInt()
    userId: number;
  
    @IsString()
    name: string;
}

export class UpdateDiaryDto {
    @IsOptional()
    @IsInt()
    userId: number;
  
    @IsString()
    name: string;
}

