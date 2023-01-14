-- CreateTable
CREATE TABLE "_UserReadingLists" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserReadingLists_A_fkey" FOREIGN KEY ("A") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserReadingLists_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserReadBooks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserReadBooks_A_fkey" FOREIGN KEY ("A") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserReadBooks_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserReadingLists_AB_unique" ON "_UserReadingLists"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReadingLists_B_index" ON "_UserReadingLists"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserReadBooks_AB_unique" ON "_UserReadBooks"("A", "B");

-- CreateIndex
CREATE INDEX "_UserReadBooks_B_index" ON "_UserReadBooks"("B");
