/*
  Warnings:

  - Added the required column `nom` to the `PortfolioExchange` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PortfolioExchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nom" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "exchange_id" TEXT NOT NULL,
    "api_data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioExchange_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PortfolioExchange" ("api_data", "exchange_id", "id", "portfolio_id", "updatedAt") SELECT "api_data", "exchange_id", "id", "portfolio_id", "updatedAt" FROM "PortfolioExchange";
DROP TABLE "PortfolioExchange";
ALTER TABLE "new_PortfolioExchange" RENAME TO "PortfolioExchange";
CREATE UNIQUE INDEX "PortfolioExchange_portfolio_id_exchange_id_nom_key" ON "PortfolioExchange"("portfolio_id", "exchange_id", "nom");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
