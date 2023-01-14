/*
  Warnings:

  - You are about to drop the column `isbn` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Book` table. All the data in the column will be lost.
  - Added the required column `isbn13` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "isbn10" TEXT,
    "isbn13" TEXT NOT NULL
);
INSERT INTO "new_Book" ("createdAt", "description", "id", "updatedAt") SELECT "createdAt", "description", "id", "updatedAt" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_title_key" ON "Book"("title");
CREATE UNIQUE INDEX "Book_isbn10_key" ON "Book"("isbn10");
CREATE UNIQUE INDEX "Book_isbn13_key" ON "Book"("isbn13");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
