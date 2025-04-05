import { PrismaClient } from "@prisma/client";
import { EventDto } from "../dto/Event.dto";  // Import DTO của Event
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { ResponseStatus } from "@src/base/config/ResponseStatus";
import { ErrorMessage, SuccessMessage } from "@src/base/message";

const prisma = new PrismaClient();

// 🚀 Lấy tất cả events
export const getAllEvents = async (): Promise<IApiResponse> => {
  const events = await prisma.event.findMany({
    include: {
      dailyDiary: true, // Bao gồm dailyDiary mà event thuộc về
    },
  });

  return {
    message: SuccessMessage.FETCH_SUCCESS, // Thông báo thành công (có thể thay bằng i18n.t nếu cần)
    responseStatus: ResponseStatus.SUCCESS,
    data: events.map(event => new EventDto(event)),
  };
};

// 🚀 Lấy một event theo ID
export const getOneEvent = async (id: number): Promise<IApiResponse> => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      dailyDiary: true,
    },
  });

  if (!event) {
    return {
      message: ErrorMessage.NOT_FOUND,
      responseStatus: ResponseStatus.NOT_FOUND,
      data: null,
    };
  }

  return {
    message: SuccessMessage.FETCH_SUCCESS,
    responseStatus: ResponseStatus.SUCCESS,
    data: new EventDto(event),
  };
};

// 🚀 Tạo mới một event
export const createEvent = async (data: { dailyDiaryId: number; content: string; eventDate: Date }): Promise<IApiResponse> => {
  const event = await prisma.event.create({
    data,
    include: {
      dailyDiary: true,
    },
  });

  return {
    message: SuccessMessage.CREATED_SUCCESS,
    responseStatus: ResponseStatus.SUCCESS,
    data: new EventDto(event),
  };
};

// 🚀 Cập nhật một event
export const updateEvent = async (id: number, data: { content?: string; eventDate?: Date }): Promise<IApiResponse> => {
  const event = await prisma.event.update({
    where: { id },
    data,
    include: {
      dailyDiary: true,
    },
  });

  return {
    message: "Event updated successfully",
    responseStatus: ResponseStatus.SUCCESS,
    data: new EventDto(event),
  };
};

// 🚀 Xóa một event
export const deleteEvent = async (id: number): Promise<IApiResponse> => {
  try {
    const eventCheck = await prisma.event.findUnique({
      where: { id },
      include: {
        dailyDiary: true,
      },
    });

    if (!eventCheck) {
      return {
        message: ErrorMessage.NOT_FOUND,
        responseStatus: ResponseStatus.NOT_FOUND,
        data: null,
      };
    }

    const event = await prisma.event.delete({
      where: { id },
    });

    return {
      message: SuccessMessage.DELETED_SUCCESS,
      responseStatus: ResponseStatus.SUCCESS,
      data: true,
    };
  } catch (error) {
    const err = error as Error;
    return {
      message: err.message,
      responseStatus: ResponseStatus.SUCCESS,
      data: true,
    };
  }
};
