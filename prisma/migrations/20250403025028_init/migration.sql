/*
  Warnings:

  - Added the required column `updateDate` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [createDate] DATETIME2 NOT NULL CONSTRAINT [User_createDate_df] DEFAULT CURRENT_TIMESTAMP,
[updateDate] DATETIME2 NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Diary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createDate] DATETIME2 NOT NULL CONSTRAINT [Diary_createDate_df] DEFAULT CURRENT_TIMESTAMP,
    [updateDate] DATETIME2 NOT NULL,
    CONSTRAINT [Diary_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[DailyDiary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [diaryId] INT NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [eventDate] DATETIME2 NOT NULL,
    [createDate] DATETIME2 NOT NULL CONSTRAINT [DailyDiary_createDate_df] DEFAULT CURRENT_TIMESTAMP,
    [updateDate] DATETIME2 NOT NULL,
    CONSTRAINT [DailyDiary_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Event] (
    [id] INT NOT NULL IDENTITY(1,1),
    [content] NVARCHAR(1000) NOT NULL,
    [eventDate] DATETIME2 NOT NULL,
    [createDate] DATETIME2 NOT NULL CONSTRAINT [Event_createDate_df] DEFAULT CURRENT_TIMESTAMP,
    [updateDate] DATETIME2 NOT NULL,
    [dailyDiaryId] INT NOT NULL,
    CONSTRAINT [Event_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Diary] ADD CONSTRAINT [Diary_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[DailyDiary] ADD CONSTRAINT [DailyDiary_diaryId_fkey] FOREIGN KEY ([diaryId]) REFERENCES [dbo].[Diary]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Event] ADD CONSTRAINT [Event_dailyDiaryId_fkey] FOREIGN KEY ([dailyDiaryId]) REFERENCES [dbo].[DailyDiary]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
