-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api_exchange_id" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Exchange" ("api_exchange_id", "id", "updatedAt") SELECT "api_exchange_id", "id", "updatedAt" FROM "Exchange";
DROP TABLE "Exchange";
ALTER TABLE "new_Exchange" RENAME TO "Exchange";
CREATE UNIQUE INDEX "Exchange_api_exchange_id_key" ON "Exchange"("api_exchange_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
