import {
	ExchangeBalancesLocalDB,
	PortfolioBlockchainsWithTransactionLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioExchangesWithTransactionLocalDB,
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokensWithTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWalletsWithTransactionsLocalDB,
	StatsData,
} from '../../prisma-types/app/portfolio/Portfolio.db.types'
import {
	EVMBalanceTransactionDB,
	EVMERC20TransactionDB,
	EVMInternalTransactionDB,
	EVMNormalTransactionDB,
} from '../../prisma-types/db-api/DB.types'

export interface IpcMessage {
	type:
		| 'log'
		| 'action:start'
		| 'action:finish'
		| 'action:stop'
		| 'action:error'
		| 'action:log'
		| 'portfolio:log'
		| 'portfolio:stats:update'
		| 'portfolio:wallets:update'
		| 'portfolio:exchanges:update'
		| 'portfolio:stats:update:response'
		| 'portfolio:wallets:update:response'
		| 'portfolio:exchanges:update:response'
		| 'error'
		| 'ping'
}

export interface GeneralMessage extends IpcMessage {
	type: 'ping' | 'log' | 'error'
}

export interface PortfolioMessage extends IpcMessage {
	data: any
}

export interface PortfolioStatsMessageUpdate extends PortfolioMessage {
	type: 'portfolio:stats:update'
	data: {
		portfolio: PortfolioLocalDB
		tokens: PortfolioTokensWithTransactionsLocalDB[]
		wallets: PortfolioWalletsWithTransactionsLocalDB[]
		blockchains: PortfolioBlockchainsWithTransactionLocalDB[]
		exchanges: PortfolioExchangesWithTransactionLocalDB[]
	}
}

export interface PortfolioStatsMessageResponse extends PortfolioMessage {
	type: 'portfolio:stats:update:response'
	data: StatsData
}

export interface PortfolioWalletsMessageUpdate extends PortfolioMessage {
	type: 'portfolio:wallets:update'
	data: {
		portfolio: PortfolioLocalDB
		wallets: PortfolioWalletsLocalDB[]
		userToken: string
	}
}

export interface PortfolioWalletsMessageResponse extends PortfolioMessage {
	type: 'portfolio:wallets:update:response'
	data: {
		portfolio: PortfolioLocalDB
		portfolioTokens: PortfolioTokensLocalDB[]
		evmBalanceTransactions: (EVMBalanceTransactionDB & { _portfolio_wallet_id: string })[]
		evmNormalTransactions: (EVMNormalTransactionDB & { _portfolio_wallet_id: string; sens: string })[] // Actuellement, c'est une seule transaction qui contient la balance du wallet
		evmInternalTransactions: (EVMInternalTransactionDB & { _portfolio_wallet_id: string; sens: string })[]
		evmERC20Transactions: (EVMERC20TransactionDB & { _portfolio_wallet_id: string; sens: string })[]
	}
}

export interface PortfolioExchangesMessageUpdate extends PortfolioMessage {
	type: 'portfolio:exchanges:update'
	data: {
		portfolio: PortfolioLocalDB
		exchanges: PortfolioExchangesLocalDB[]
		userToken: string
	}
}

export interface PortfolioExchangesMessageResponse extends PortfolioMessage {
	type: 'portfolio:exchanges:update:response'
	data: {
		portfolio: PortfolioLocalDB
		portfolioTokens: PortfolioTokensLocalDB[]
		balances: ExchangeBalancesLocalDB[]
	}
}

export interface DCAMessage extends IpcMessage {
	data: any
}
