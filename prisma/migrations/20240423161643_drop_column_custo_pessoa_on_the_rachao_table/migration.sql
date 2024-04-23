/*
  Warnings:

  - You are about to drop the column `custoPessoa` on the `Rachao` table. All the data in the column will be lost.

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
    "status" BOOLEAN NOT NULL DEFAULT true,
    "sessionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Rachao" ("createdAt", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "sessionId", "status", "updatedAt") SELECT "createdAt", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "sessionId", "status", "updatedAt" FROM "Rachao";
DROP TABLE "Rachao";
ALTER TABLE "new_Rachao" RENAME TO "Rachao";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
