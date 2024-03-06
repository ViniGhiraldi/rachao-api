/*
  Warnings:

  - Added the required column `updatedAt` to the `Rachao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Times` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Despesas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Resultados` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Jogadores` table without a default value. This is not possible if the table is not empty.

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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Rachao" ("custoPessoa", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "status") SELECT "custoPessoa", "custoTotal", "diahora", "id", "local", "modalidade", "nome", "regras", "senha", "status" FROM "Rachao";
DROP TABLE "Rachao";
ALTER TABLE "new_Rachao" RENAME TO "Rachao";
CREATE TABLE "new_Times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Times_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Times" ("id", "nome", "rachaoId") SELECT "id", "nome", "rachaoId" FROM "Times";
DROP TABLE "Times";
ALTER TABLE "new_Times" RENAME TO "Times";
CREATE TABLE "new_Despesas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "custoUnitario" DECIMAL NOT NULL,
    "custoTotal" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Despesas_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Despesas" ("custoTotal", "custoUnitario", "id", "quantidade", "rachaoId", "titulo") SELECT "custoTotal", "custoUnitario", "id", "quantidade", "rachaoId", "titulo" FROM "Despesas";
DROP TABLE "Despesas";
ALTER TABLE "new_Despesas" RENAME TO "Despesas";
CREATE TABLE "new_Resultados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "timeCasaId" TEXT NOT NULL,
    "timeVisitanteId" TEXT NOT NULL,
    "timeVencedorId" TEXT,
    "resultado" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Resultados_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeVisitanteId_fkey" FOREIGN KEY ("timeVisitanteId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeVencedorId_fkey" FOREIGN KEY ("timeVencedorId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Resultados" ("duracao", "id", "rachaoId", "resultado", "timeCasaId", "timeVencedorId", "timeVisitanteId") SELECT "duracao", "id", "rachaoId", "resultado", "timeCasaId", "timeVencedorId", "timeVisitanteId" FROM "Resultados";
DROP TABLE "Resultados";
ALTER TABLE "new_Resultados" RENAME TO "Resultados";
CREATE TABLE "new_Jogadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeId" TEXT,
    "rachaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nota" DECIMAL NOT NULL DEFAULT 0,
    "presenca" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jogadores_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jogadores_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jogadores" ("id", "nome", "nota", "presenca", "rachaoId", "timeId") SELECT "id", "nome", "nota", "presenca", "rachaoId", "timeId" FROM "Jogadores";
DROP TABLE "Jogadores";
ALTER TABLE "new_Jogadores" RENAME TO "Jogadores";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
