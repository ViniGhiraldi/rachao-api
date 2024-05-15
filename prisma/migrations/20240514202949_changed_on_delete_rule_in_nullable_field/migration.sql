-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Jogadores_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "Times" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Jogadores" ("createdAt", "id", "nome", "nota", "presenca", "rachaoId", "timeId", "updatedAt") SELECT "createdAt", "id", "nome", "nota", "presenca", "rachaoId", "timeId", "updatedAt" FROM "Jogadores";
DROP TABLE "Jogadores";
ALTER TABLE "new_Jogadores" RENAME TO "Jogadores";
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
    CONSTRAINT "Resultados_timeVencedorId_fkey" FOREIGN KEY ("timeVencedorId") REFERENCES "Times" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Resultados" ("createdAt", "duracao", "id", "rachaoId", "resultado", "timeCasaId", "timeVencedorId", "timeVisitanteId", "updatedAt") SELECT "createdAt", "duracao", "id", "rachaoId", "resultado", "timeCasaId", "timeVencedorId", "timeVisitanteId", "updatedAt" FROM "Resultados";
DROP TABLE "Resultados";
ALTER TABLE "new_Resultados" RENAME TO "Resultados";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
