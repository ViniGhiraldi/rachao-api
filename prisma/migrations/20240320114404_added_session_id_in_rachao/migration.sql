/*
  Warnings:

  - Added the required column `sessionId` to the `Rachao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rachao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "diahora" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "regras" TEXT,
    "custoTotal" DECIMAL NOT NULL DEFAULT 0,
    "custoPessoa" DECIMAL NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "sessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Rachao" ("createdAt", "custoPessoa", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "status", "updatedAt") SELECT "createdAt", "custoPessoa", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "status", "updatedAt" FROM "Rachao";
DROP TABLE "Rachao";
ALTER TABLE "new_Rachao" RENAME TO "Rachao";
CREATE UNIQUE INDEX "Rachao_sessionId_key" ON "Rachao"("sessionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
