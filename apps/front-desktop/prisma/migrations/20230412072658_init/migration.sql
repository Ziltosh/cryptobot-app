-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api_user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "user_id" TEXT,
    "isUpdating" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Portfolio_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api_exchange_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Blockchain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api_blockchain_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PortfolioToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolio_id" TEXT NOT NULL DEFAULT '',
    "api_token_id" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioToken_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioExchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolio_id" TEXT NOT NULL,
    "exchange_id" TEXT NOT NULL,
    "api_data" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioExchange_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioWallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "address_type" TEXT NOT NULL DEFAULT 'evm',
    "portfolio_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioWallet_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" INTEGER NOT NULL DEFAULT 0,
    "hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT '',
    "prix" REAL NOT NULL DEFAULT 0,
    "token_natif_prix" REAL NOT NULL DEFAULT 0,
    "type_transaction" TEXT NOT NULL DEFAULT '',
    "quantite" REAL NOT NULL DEFAULT 0,
    "fee_quantite" REAL NOT NULL DEFAULT 0,
    "block_number" INTEGER NOT NULL,
    "is_error" BOOLEAN NOT NULL,
    "blockchain_id" TEXT NOT NULL,
    "portfolio_wallet_id" TEXT NOT NULL,
    "portfolio_token_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WalletTransaction_portfolio_token_id_fkey" FOREIGN KEY ("portfolio_token_id") REFERENCES "PortfolioToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WalletTransaction_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "Blockchain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WalletTransaction_portfolio_wallet_id_fkey" FOREIGN KEY ("portfolio_wallet_id") REFERENCES "PortfolioWallet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TokenTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT '',
    "prix" REAL NOT NULL DEFAULT 0,
    "quantite" REAL NOT NULL DEFAULT 0,
    "fee_quantite" REAL NOT NULL DEFAULT 0,
    "exchange_id" TEXT,
    "blockchain_id" TEXT,
    "portfolio_token_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TokenTransaction_portfolio_token_id_fkey" FOREIGN KEY ("portfolio_token_id") REFERENCES "PortfolioToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TokenTransaction_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "Exchange" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TokenTransaction_blockchain_id_fkey" FOREIGN KEY ("blockchain_id") REFERENCES "Blockchain" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExchangeTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL DEFAULT '',
    "prix" REAL NOT NULL DEFAULT 0,
    "quantite" REAL NOT NULL DEFAULT 0,
    "fee_quantite" REAL NOT NULL DEFAULT 0,
    "portfolio_exchange_id" TEXT NOT NULL,
    "exchange_id" TEXT NOT NULL,
    "portfolio_token_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExchangeTransaction_portfolio_token_id_fkey" FOREIGN KEY ("portfolio_token_id") REFERENCES "PortfolioToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExchangeTransaction_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "Exchange" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ExchangeTransaction_portfolio_exchange_id_fkey" FOREIGN KEY ("portfolio_exchange_id") REFERENCES "PortfolioExchange" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioStats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "portfolio_id" TEXT NOT NULL,
    "date" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "evolutionPct" REAL NOT NULL,
    "evolutionValue" REAL NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PortfolioStats_portfolio_id_fkey" FOREIGN KEY ("portfolio_id") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TokenApi" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "api_token_id" TEXT NOT NULL,
    "portfolio_token_id" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TokenApi_portfolio_token_id_fkey" FOREIGN KEY ("portfolio_token_id") REFERENCES "PortfolioToken" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_api_user_id_key" ON "User"("api_user_id");

-- CreateIndex
CREATE INDEX "Portfolio_isUpdating_idx" ON "Portfolio"("isUpdating");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_name_user_id_key" ON "Portfolio"("name", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Exchange_api_exchange_id_key" ON "Exchange"("api_exchange_id");

-- CreateIndex
CREATE UNIQUE INDEX "Blockchain_api_blockchain_id_key" ON "Blockchain"("api_blockchain_id");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioExchange_portfolio_id_exchange_id_key" ON "PortfolioExchange"("portfolio_id", "exchange_id");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioWallet_address_portfolio_id_key" ON "PortfolioWallet"("address", "portfolio_id");

-- CreateIndex
CREATE INDEX "WalletTransaction_type_transaction_idx" ON "WalletTransaction"("type_transaction");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_date_hash_from_to_type_prix_quantite_blockchain_id_portfolio_token_id_type_transaction_portfolio_wallet_id_key" ON "WalletTransaction"("date", "hash", "from", "to", "type", "prix", "quantite", "blockchain_id", "portfolio_token_id", "type_transaction", "portfolio_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioStats_date_portfolio_id_key" ON "PortfolioStats"("date", "portfolio_id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenApi_api_token_id_key" ON "TokenApi"("api_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "TokenApi_portfolio_token_id_key" ON "TokenApi"("portfolio_token_id");

-- CreateIndex
CREATE INDEX "TokenApi_api_token_id_idx" ON "TokenApi"("api_token_id");
