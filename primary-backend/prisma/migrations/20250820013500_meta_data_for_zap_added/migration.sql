/*
  Warnings:

  - You are about to drop the column `metadata` on the `ZapRunOutbox` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "ZapRunOutbox" DROP COLUMN "metadata";
