-- AlterTable
ALTER TABLE "User" ALTER COLUMN "active" SET DEFAULT true;

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "secretKey" TEXT NOT NULL,
    "userId" INTEGER,
    "exp" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
