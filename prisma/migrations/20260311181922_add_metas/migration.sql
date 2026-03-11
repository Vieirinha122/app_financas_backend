-- CreateEnum
CREATE TYPE "MetaStatus" AS ENUM ('ATIVA', 'CONCLUIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Meta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "emoji" TEXT DEFAULT '🎯',
    "cor" TEXT DEFAULT '#00D084',
    "valorAlvo" DECIMAL(65,30) NOT NULL,
    "prazo" TIMESTAMP(3),
    "status" "MetaStatus" NOT NULL DEFAULT 'ATIVA',
    "prioridade" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaContribuicao" (
    "id" TEXT NOT NULL,
    "metaId" TEXT NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetaContribuicao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Meta_userId_idx" ON "Meta"("userId");

-- AddForeignKey
ALTER TABLE "Meta" ADD CONSTRAINT "Meta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaContribuicao" ADD CONSTRAINT "MetaContribuicao_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "Meta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
