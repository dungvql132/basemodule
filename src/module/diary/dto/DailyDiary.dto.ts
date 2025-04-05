import { Type } from "class-transformer";
import { IsString, IsDateString, IsInt, IsOptional } from "class-validator";
import { EventDto } from "./Event.dto"; // Import DTO của Event
import { DailyDiary, Event } from "@prisma/client";

export class DailyDiaryDto {
  @IsInt()
  id: number;

  @IsInt()
  diaryId: number;

  @IsString()
  content: string;

  @IsDateString()
  eventDate: Date;

  @IsDateString()
  createDate: Date;

  @IsDateString()
  updateDate: Date;

  @Type(() => EventDto)
  events: EventDto[];  // Lưu ý thêm EventDTO

  constructor(dailyDiary: DailyDiary & { events?: Event[] }) {
    this.id = dailyDiary.id;
    this.content = dailyDiary.content;
    this.eventDate = dailyDiary.eventDate;
    this.createDate = dailyDiary.createDate;
    this.updateDate = dailyDiary.updateDate;
    // Kiểm tra nếu có events thì map sang EventDto, nếu không thì trả về mảng rỗng
    this.events = dailyDiary.events ? dailyDiary.events.map((event) => new EventDto(event)) : [];
  }
}

export class CreateDailyDiaryDto {
    @IsInt()
    diaryId: number;
  
    @IsString()
    content: string;
  
    @IsDateString()
    eventDate: Date;
}

export class UpdateDailyDiaryDto {
    @IsOptional()
    @IsInt()
    diaryId: number;
  
    @IsString()
    content: string;
  
    @IsOptional()
    @IsDateString()
    eventDate: Date;
}