-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
