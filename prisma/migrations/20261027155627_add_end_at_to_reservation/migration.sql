/*
  Warnings:

  - Added the required column `endAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "endAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Reservation_spaceId_status_startAt_endAt_idx" ON "Reservation"("spaceId", "status", "startAt", "endAt");
