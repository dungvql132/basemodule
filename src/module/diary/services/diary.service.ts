import { PrismaClient } from "@prisma/client";
import { DiaryDto } from "../dto/Diary.dto";
import { IApiResponse } from "@src/base/interface/ApiResponse";
import { ResponseStatus } from "@src/base/config/ResponseStatus";
import i18n from "i18next";
import { SuccessMessage, ErrorMessage } from "@src/base/message";

const prisma = new PrismaClient();

// 🚀 Lấy tất cả diaries
export const getAllDiaries = async (): Promise<IApiResponse> => {
  const diaries = await prisma.diary.findMany({
    include: {
      dailyDiaries: { include: { events: true } },
    },
  });

  return {
    message: i18n.t(SuccessMessage.FETCH_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
    data: diaries.map(diary => new DiaryDto(diary)),
  };
};

// 🚀 Lấy một diary theo ID
export const getOneDiary = async (id: number, fromDate?: string, endDate?: string): Promise<IApiResponse> => {
  // Tạo một điều kiện lọc cho eventDate nếu từ ngày và đến ngày có trong query parameters
  let dateFilter = {};

  if (fromDate) {
    // Đặt fromDate là đầu ngày (00:00:00)
    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0); // Đặt giờ là 00:00:00
    dateFilter = {
      ...dateFilter,
      eventDate: {
        gte: startDate, // Sử dụng fromDate nếu có
      },
    };
  }

  if (endDate) {
    // Đặt endDate là cuối ngày (23:59:59)
    const endOfDate = new Date(endDate);
    endOfDate.setHours(23, 59, 59, 999); // Đặt giờ là 23:59:59
    dateFilter = {
      ...dateFilter,
      eventDate: {
        lte: endOfDate, // Sử dụng endDate nếu có
      },
    };
  }

  const diary = await prisma.diary.findUnique({
    where: { id },
    include: {
      dailyDiaries: {
        where: dateFilter, // Áp dụng điều kiện lọc cho dailyDiaries
        include: {
          events: true, // Bao gồm sự kiện cho dailyDiary
        },
      },
    },
  });

  if (!diary) {
    return {
      message: i18n.t(ErrorMessage.NOT_FOUND),
      responseStatus: ResponseStatus.NOT_FOUND,
      data: null,
    };
  }

  return {
    message: i18n.t(SuccessMessage.FETCH_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
    data: new DiaryDto(diary),
  };
};



// 🚀 Tạo diary mới
export const createDiary = async (data: { userId: number; name: string }): Promise<IApiResponse> => {
  const diary = await prisma.diary.create({
    data,
    include: {
      dailyDiaries: { include: { events: true } },
    },
  });

  return {
    message: i18n.t(SuccessMessage.CREATED_SUCCESS),
    responseStatus: ResponseStatus.SUCCESS,
    data: new DiaryDto(diary),
  };
};

// 🚀 Cập nhật diary
export const updateDiary = async (id: number, data: { name: string }): Promise<IApiResponse> => {
  try {
    const diary = await prisma.diary.update({
      where: { id },
      data,
      include: {
        dailyDiaries: { include: { events: true } },
      },
    });

    return {
      message: i18n.t(SuccessMessage.UPDATED_SUCCESS),
      responseStatus: ResponseStatus.SUCCESS,
      data: new DiaryDto(diary),
    };
  } catch (error) {
    return {
      message: i18n.t(ErrorMessage.UPDATED_FAIL),
      responseStatus: ResponseStatus.INTERNAL_ERROR,
      data: null,
    };
  }
};

// 🚀 Xóa diary
export const deleteDiary = async (id: number): Promise<IApiResponse> => {
  try {
    // 1. Lấy tất cả DailyDiary của Diary
    const dailyDiaries = await prisma.dailyDiary.findMany({
      where: { diaryId: id },
      select: { id: true },
    });

    const dailyDiaryIds = dailyDiaries.map(d => d.id);

    // 2. Xóa tất cả Event liên quan
    if (dailyDiaryIds.length > 0) {
      await prisma.event.deleteMany({
        where: {
          dailyDiaryId: { in: dailyDiaryIds },
        },
      });

      // 3. Xóa DailyDiary
      await prisma.dailyDiary.deleteMany({
        where: {
          id: { in: dailyDiaryIds },
        },
      });
    }

    // 4. Xóa Diary
    await prisma.diary.delete({
      where: { id },
    });

    return {
      message: i18n.t(SuccessMessage.DELETED_SUCCESS),
      responseStatus: ResponseStatus.SUCCESS,
      data: true,
    };
  } catch (error) {
    return {
      message: i18n.t(ErrorMessage.DELETED_FAIL),
      responseStatus: ResponseStatus.INTERNAL_ERROR,
      data: false,
    };
  }
};

