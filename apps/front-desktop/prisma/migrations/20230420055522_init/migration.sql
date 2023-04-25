/*
  Warnings:

  - You are about to drop the `ExchangeTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExchangeTransaction";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ExchangeBalance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT '',
    "prix" REAL NOT NULL DEFAULT 0,
    "diff" REAL NOT NULL DEFAULT 0,
    "total" REAL NOT NULL DEFAULT 0,
    "fee_quantite" REAL NOT NULL DEFAULT 0,
    "portfolio_exchange_id" TEXT NOT NULL,
    "exchange_id" TEXT NOT NULL,
    "portfolio_token_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExchangeBalance_portfolio_token_id_fkey" FOREIGN KEY ("portfolio_token_id") REFERENCES "PortfolioToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExchangeBalance_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "Exchange" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExchangeBalance_portfolio_exchange_id_fkey" FOREIGN KEY ("portfolio_exchange_id") REFERENCES "PortfolioExchange" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
