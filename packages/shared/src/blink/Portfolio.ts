import {
	PortfolioExchangeBalancesLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioStatsLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWalletTransactionsLocalDB,
	PortfolioWithStatsLocalDB
} from "../prisma-types/app/portfolio/Portfolio.db.types";
import { createDB, createTable } from "blinkdb";
import { BlockchainDB, ExchangeDB, TokenDB } from "../prisma-types/db-api/DB.types";

interface PortfolioBlink extends PortfolioWithStatsLocalDB {
	_isCurrent?: boolean
}
type PortfolioWalletBlink = PortfolioWalletsLocalDB
interface PortfolioTokenBlink extends PortfolioTokensLocalDB {
	_tokenApiData: TokenDB
	_isCurrent?: boolean
}
interface PortfolioWalletTransactionBlink extends PortfolioWalletTransactionsLocalDB {
	_blockchainData: BlockchainDB
}
interface PortfolioExchangeBlink extends PortfolioExchangesLocalDB {
	_exchangeData: ExchangeDB
}
interface PortfolioExchangeBalanceBlink extends PortfolioExchangeBalancesLocalDB {
	_exchangeData: ExchangeDB
}
interface PortfolioTokenTransactionBlink extends PortfolioTokenTransactionsLocalDB {
	_isCurrent?: boolean
}
type PortfolioStatsBlink = PortfolioStatsLocalDB
interface PortfolioLogsBlink {
	id: string
	message: string
}

const blinkDb = createDB()

export const portfolioTable = createTable<PortfolioBlink>(blinkDb, 'portfolios')()

export const portfolioWalletTable = createTable<PortfolioWalletBlink>(blinkDb, 'portfolioWallets')()

export const portfolioWalletTransactionTable = createTable<PortfolioWalletTransactionBlink>(
	blinkDb,
	'portfolioWalletTransactions'
)()

export const portfolioTokenTransactionTable = createTable<PortfolioTokenTransactionBlink>(
	blinkDb,
	'portfolioTokenTransactions'
)()

export const portfolioTokenTable = createTable<PortfolioTokenBlink>(blinkDb, 'portfolioTokens')()

export const portfolioStatsTable = createTable<PortfolioStatsBlink>(blinkDb, 'portfolioStats')()

export const portfolioLogsTable = createTable<PortfolioLogsBlink>(blinkDb, 'portfolioLogs')()

export const portfolioExchangeTable = createTable<PortfolioExchangeBlink>(blinkDb, 'portfolioExchanges')()

export const portfolioExchangeBalanceTable = createTable<PortfolioExchangeBalanceBlink>(
	blinkDb,
	'portfolioExchangeBalances'
)()

// use(portfolioTable, async (ctx) => {
// 	// Execute code before calling the implementation
// 	console.log('[BLINK ACTION]', ctx.action) // Log the method called
// 	console.log('[BLINK PARAMS]', ctx.params) // Log parameters given to the method
//
// 	// Call the native implementation
// 	const result = await ctx.next(...ctx.params)
//
// 	// Execute code after the implementation
// 	console.log('Everything worked!')
//
// 	// Don't forget to return the result ;)
// 	return result
// })
