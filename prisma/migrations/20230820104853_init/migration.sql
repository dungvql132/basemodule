-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserViewWords" (
    "userId" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,

    CONSTRAINT "UserViewWords_pkey" PRIMARY KEY ("userId","wordId")
);

-- CreateTable
CREATE TABLE "WordDetail" (
    "id" SERIAL NOT NULL,
    "meaning" TEXT NOT NULL,
    "wordId" INTEGER,
    "wordTypeId" INTEGER,

    CONSTRAINT "WordDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordExample" (
    "id" SERIAL NOT NULL,
    "example" TEXT NOT NULL,
    "wordDetailId" INTEGER NOT NULL,

    CONSTRAINT "WordExample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "WordType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewWords" ADD CONSTRAINT "UserViewWords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserViewWords" ADD CONSTRAINT "UserViewWords_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordDetail" ADD CONSTRAINT "WordDetail_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordDetail" ADD CONSTRAINT "WordDetail_wordTypeId_fkey" FOREIGN KEY ("wordTypeId") REFERENCES "WordType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordExample" ADD CONSTRAINT "WordExample_wordDetailId_fkey" FOREIGN KEY ("wordDetailId") REFERENCES "WordDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
