import { Type } from "class-transformer";
import { IsInt, IsString, IsDate, IsOptional } from "class-validator";
import { DailyDiary, Event } from "@prisma/client";

export class EventDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsInt()
  dailyDiaryId: number;

  @IsString()
  content: string;

  @IsDate()
  @Type(() => Date)
  eventDate: Date;

  @IsOptional()
  @Type(() => Date)
  createDate?: Date;

  @IsOptional()
  @Type(() => Date)
  updateDate?: Date;

  constructor(event: Event) {
    this.id = event.id;
    this.content = event.content;
    this.eventDate = event.eventDate;
    this.createDate = event.createDate;
    this.updateDate = event.updateDate;
  }
}

export class CreateEventDto {
    @IsInt()
    dailyDiaryId: number;
  
    @IsString()
    content: string;
  
    @IsDate()
    @Type(() => Date)
    eventDate: Date;
}

export class UpdateEventDto {
    @IsString()
    content: string;
  
    @IsDate()
    @Type(() => Date)
    eventDate: Date;
}