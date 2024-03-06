-- CreateTable
CREATE TABLE "Rachao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "modalidade" TEXT NOT NULL,
    "diahora" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "regras" TEXT,
    "custoTotal" DECIMAL NOT NULL DEFAULT 0,
    "custoPessoa" DECIMAL NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    CONSTRAINT "Times_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Jogadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "timeId" TEXT,
    "rachaoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nota" DECIMAL NOT NULL DEFAULT 0,
    "presenca" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Jogadores_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Jogadores_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Despesas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "custoUnitario" DECIMAL NOT NULL,
    "custoTotal" DECIMAL NOT NULL,
    CONSTRAINT "Despesas_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Resultados" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rachaoId" TEXT NOT NULL,
    "timeCasaId" TEXT NOT NULL,
    "timeVisitanteId" TEXT NOT NULL,
    "timeVencedorId" TEXT,
    "resultado" TEXT NOT NULL,
    "duracao" TEXT NOT NULL,
    CONSTRAINT "Resultados_rachaoId_fkey" FOREIGN KEY ("rachaoId") REFERENCES "Rachao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeCasaId_fkey" FOREIGN KEY ("timeCasaId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeVisitanteId_fkey" FOREIGN KEY ("timeVisitanteId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resultados_timeVencedorId_fkey" FOREIGN KEY ("timeVencedorId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Imagem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "timeId" TEXT,
    "jogadorId" TEXT,
    CONSTRAINT "Imagem_timeId_fkey" FOREIGN KEY ("timeId") REFERENCES "Times" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Imagem_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogadores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Imagem_timeId_key" ON "Imagem"("timeId");

-- CreateIndex
CREATE UNIQUE INDEX "Imagem_jogadorId_key" ON "Imagem"("jogadorId");
