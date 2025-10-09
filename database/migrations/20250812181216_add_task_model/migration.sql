-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('A_FAZER', 'EM_ANDAMENTO', 'CONCLUIDO');

-- CreateTable
CREATE TABLE "public"."task" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "public"."TaskPriority" NOT NULL DEFAULT 'MEDIA',
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'A_FAZER',
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "task_userId_idx" ON "public"."task"("userId");

-- AddForeignKey
ALTER TABLE "public"."task" ADD CONSTRAINT "task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
