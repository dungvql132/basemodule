import { PrismaClient } from "@prisma/client";
import { DailyDiaryDto } from "../dto/DailyDiary.dto";  // Import DTO của DailyDiary
import { EventDto } from "../dto/Event.dto"; // Import DTO của Event
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { ResponseStatus } from "@src/base/config/ResponseStatus";
import { ErrorMessage, SuccessMessage } from "@src/base/message";

const prisma = new PrismaClient();

// 🚀 Lấy tất cả daily diaries
export const getAllDailyDiaries = async (): Promise<IApiResponse> => {
  const dailyDiaries = await prisma.dailyDiary.findMany({
    include: {
      events: true, // Bao gồm các sự kiện của dailyDiary
    },
  });

  return {
    message: SuccessMessage.FETCH_SUCCESS, // Thông báo thành công (có thể thay bằng i18n.t nếu cần)
    responseStatus: ResponseStatus.SUCCESS,
    data: dailyDiaries.map(dailyDiary => new DailyDiaryDto({...dailyDiary})),
    }
};

export const getOneDailyDiary = async (id: number): Promise<IApiResponse> => {
  const dailyDiary = await prisma.dailyDiary.findUnique({
    where: { id },
    include: {
      events: true,
    },
  });

  if (!dailyDiary) {
    return {
      message: ErrorMessage.NOT_FOUND, 
      responseStatus: ResponseStatus.NOT_FOUND,
      data: null,
    };
  }

  return {
    message: SuccessMessage.FETCH_SUCCESS,
    responseStatus: ResponseStatus.SUCCESS,
    data: new DailyDiaryDto({...dailyDiary}),
  };
};

export const createDailyDiary = async (
    data: { diaryId: number; content: string; eventDate: Date }
  ): Promise<IApiResponse> => {
    // Kiểm tra xem đã có dailyDiary với cùng diaryId và eventDate chưa
    const existingDailyDiary = await prisma.dailyDiary.findFirst({
      where: {
        diaryId: data.diaryId,
        eventDate: data.eventDate,
      },
    });
  
    if (existingDailyDiary) {
      return {
        message: ErrorMessage.DUPLICATE, // Thông báo lỗi trùng lặp
        responseStatus: ResponseStatus.DUPLICATE, // HTTP 409 Conflict
        data: null,
      };
    }
  
    // Tạo mới nếu không có bản ghi trùng
    const dailyDiary = await prisma.dailyDiary.create({
      data,
      include: {
        events: true,
      },
    });
  
    return {
      message: SuccessMessage.CREATED_SUCCESS,
      responseStatus: ResponseStatus.SUCCESS,
      data: new DailyDiaryDto({ ...dailyDiary }),
    };
  };

export const updateDailyDiary = async (
  id: number,
  data: { content?: string; eventDate?: Date }
): Promise<IApiResponse> => {
  const dailyDiary = await prisma.dailyDiary.update({
    where: { id },
    data,
    include: {
      events: true,
    },
  });

  return {
    message: "DailyDiary updated successfully",
    responseStatus: ResponseStatus.SUCCESS,
    data: new DailyDiaryDto({...dailyDiary}),
  };
};

export const deleteDailyDiary = async (id: number): Promise<IApiResponse> => {
    try {
      const dailyDiaryCheck = await prisma.dailyDiary.findUnique({
        where: { id },
        include: {
          events: true,
        },
      });
  
      if (!dailyDiaryCheck) {
        return {
          message: ErrorMessage.NOT_FOUND,
          responseStatus: ResponseStatus.NOT_FOUND,
          data: null,
        };
      }
  
      // Xóa toàn bộ events liên kết trước
      await prisma.event.deleteMany({
        where: { dailyDiaryId: id },
      });
  
      // Sau đó xóa DailyDiary
      await prisma.dailyDiary.delete({
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
        responseStatus: ResponseStatus.INTERNAL_ERROR,
        data: false,
      };
    }
  };
  

