import { BlockchainDB, ExchangeDB, TokenDB, UserDB } from "../../db-api";
import { Prisma } from "../../app/client";

const portfolio = Prisma.validator<Prisma.PortfolioArgs>()({})
export type PortfolioLocalDB = Prisma.PortfolioGetPayload<typeof portfolio> & {
	_emplacement?: string
	_isNew?: boolean
}

const portfolioWithStats = Prisma.validator<Prisma.PortfolioArgs>()({
	include: {
		PortfolioStats: true,
	},
})
const portfolioWithTokens = Prisma.validator<Prisma.PortfolioArgs>()({
	include: {
		PortfolioTokens: {
			include: {
				TokenTransactions: {
					include: {
						BlockchainOrigine: true,
						ExchangeOrigine: true,
					},
				},
			},
		},
	},
})
const portfolioWithExchanges = Prisma.validator<Prisma.PortfolioArgs>()({
	include: {
		PortfolioExchanges: {
			include: {
				ExchangeBalances: {
					include: {
						ExchangeOrigine: true,
					},
				},
			},
		},
	},
})
const portfolioWithWallets = Prisma.validator<Prisma.PortfolioArgs>()({
	include: {
		PortfolioWallets: {
			include: {
				WalletTransactions: {
					include: {
						BlockchainOrigine: true,
					},
				},
			},
		},
	},
})
export type PortfolioWithStatsLocalDB = Prisma.PortfolioGetPayload<typeof portfolioWithStats> & {
	_emplacement?: string
}
export type PortfolioWithAllLocalDB = Prisma.PortfolioGetPayload<
	typeof portfolioWithStats & typeof portfolioWithTokens & typeof portfolioWithExchanges & typeof portfolioWithWallets
>

//////

const portfolioWallets = Prisma.validator<Prisma.PortfolioWalletArgs>()({})
export type PortfolioWalletsLocalDB = Prisma.PortfolioWalletGetPayload<typeof portfolioWallets> & {
	_isNew?: boolean
}

const portfolioWalletsWithTransactions = Prisma.validator<Prisma.PortfolioWalletArgs>()({
	include: {
		WalletTransactions: {
			include: {
				BlockchainOrigine: true,
				PortfolioToken: true,
			},
		},
	},
})
export type PortfolioWalletsWithTransactionsLocalDB = Prisma.PortfolioWalletGetPayload<
	typeof portfolioWalletsWithTransactions
>

//////

const portfolioTokenTransactions = Prisma.validator<Prisma.TokenTransactionArgs>()({})

export type PortfolioTokenTransactionsLocalDB = Prisma.TokenTransactionGetPayload<typeof portfolioTokenTransactions> & {
	_isNew?: boolean
	_isValidated?: boolean
	_apiTokenId?: string
	_blockchainData?: BlockchainDB
	_exchangeData?: ExchangeDB
}

//////

const portfolioWalletTransactions = Prisma.validator<Prisma.WalletTransactionArgs>()({})
export type PortfolioWalletTransactionsLocalDB = Prisma.WalletTransactionGetPayload<
	typeof portfolioWalletTransactions
> & {
	_apiTokenId?: string
	_blockchainData?: BlockchainDB
}

//////

const portfolioExchangeBalances = Prisma.validator<Prisma.ExchangeBalanceArgs>()({})
export type PortfolioExchangeBalancesLocalDB = Prisma.ExchangeBalanceGetPayload<typeof portfolioExchangeBalances> & {
	_apiTokenId?: string
	_exchangeData?: ExchangeDB
}

//////

const portfolioTokens = Prisma.validator<Prisma.PortfolioTokenArgs>()({})
export type PortfolioTokensLocalDB = Prisma.PortfolioTokenGetPayload<typeof portfolioTokens> & {
	_tokenApiData: TokenDB
}

const portfolioTokensWithTransactions = Prisma.validator<Prisma.PortfolioTokenArgs>()({
	include: {
		TokenTransactions: {
			include: {
				BlockchainOrigine: true,
				ExchangeOrigine: true,
			},
		},
		WalletTransactions: {
			include: {
				BlockchainOrigine: true,
			},
		},
		ExchangeBalances: {
			include: {
				ExchangeOrigine: true,
			},
		},
	},
})
export type PortfolioTokensWithTransactionsLocalDB = Prisma.PortfolioTokenGetPayload<
	typeof portfolioTokensWithTransactions
> & {
	_tokenApiData: TokenDB
}

//////

const portfolioStats = Prisma.validator<Prisma.PortfolioStatsArgs>()({})
export type PortfolioStatsLocalDB = Prisma.PortfolioStatsGetPayload<typeof portfolioStats>

const users = Prisma.validator<Prisma.PortfolioTokenArgs>()({})
export type UserLocalDB = Prisma.PortfolioTokenGetPayload<typeof users> & {
	_userApiData: UserDB
}

///////

const portfolioBlockchainsWithTransaction = Prisma.validator<Prisma.BlockchainArgs>()({
	include: {
		TokenTransactions: {
			include: {
				ExchangeOrigine: true,
				BlockchainOrigine: true,
				PortfolioToken: true,
			},
		},
		WalletTransactions: {
			include: {
				BlockchainOrigine: true,
				PortfolioToken: true,
			},
		},
	},
})
export type PortfolioBlockchainsWithTransactionLocalDB = Prisma.BlockchainGetPayload<
	typeof portfolioBlockchainsWithTransaction
> & {
	_blockchainData?: BlockchainDB
}

///////

const exchanges = Prisma.validator<Prisma.ExchangeArgs>()({})
export type ExchangeLocalDB = Prisma.ExchangeGetPayload<typeof exchanges>

const portfolioExchanges = Prisma.validator<Prisma.PortfolioExchangeArgs>()({})
export type PortfolioExchangesLocalDB = Prisma.PortfolioExchangeGetPayload<typeof portfolioExchanges> & {
	_exchangeData: ExchangeDB
}

const portfolioExchangesWithTransaction = Prisma.validator<Prisma.ExchangeArgs>()({
	include: {
		TokenTransactions: {
			include: {
				ExchangeOrigine: true,
				BlockchainOrigine: true,
				PortfolioToken: true,
			},
		},
		ExchangeBalances: {
			include: {
				ExchangeOrigine: true,
				PortfolioToken: true,
			},
		},
	},
})
export type PortfolioExchangesWithTransactionLocalDB = Prisma.ExchangeGetPayload<
	typeof portfolioExchangesWithTransaction
> & {
	_exchangeData?: ExchangeDB
}

///////

const exchangeBalances = Prisma.validator<Prisma.ExchangeBalanceArgs>()({})
export type ExchangeBalancesLocalDB = Prisma.ExchangeBalanceGetPayload<typeof exchangeBalances>

///////

const tokenApi = Prisma.validator<Prisma.TokenApiArgs>()({})
export type TokenApiLocalDB = Prisma.TokenApiGetPayload<typeof tokenApi>

///////

interface PortfolioGlobalStatsData {
	evolutionPct: number
	evolutionValeur: number
	valeurActuelle: number
}

export interface PortfolioStatsData extends PortfolioGlobalStatsData {
	id: string
	nbTransactions: number
}

export interface PortfolioTokenStatsData extends PortfolioGlobalStatsData {
	id: string
	symbol: string
	name: string
	_blockchains?: BlockchainDB[]
	_exchanges?: ExchangeDB[]
	prixActuel: number
	pru: number
	quantiteActuelle: number
	quantiteIn: number
	quantiteOut: number
	valeurIn: number
	valeurOut: number
	valeurFees: number
	quantiteFees: number
	allocationPct: number
}

export interface PortfolioWalletStatsData extends PortfolioGlobalStatsData {
	address: string
	name: string
	allocationPct: number
	nbTransactions: number
	tokens: PortfolioTokenStatsData[]
}

export interface PortfolioBlockchainStatsData extends PortfolioGlobalStatsData {
	id: string
	api_blockchain_id: string
	name: string
	_blockchainData?: BlockchainDB
	allocationPct: number
	tokens: PortfolioTokenStatsData[]
}

export interface PortfolioExchangeStatsData extends PortfolioGlobalStatsData {
	id: string
	api_exchange_id: string
	name: string
	_exchangeData?: ExchangeDB
	allocationPct: number
	tokens: PortfolioTokenStatsData[]
}

export interface StatsData {
	portfolio: PortfolioStatsData
	tokens: PortfolioTokenStatsData[]
	wallets: PortfolioWalletStatsData[]
	blockchains: PortfolioBlockchainStatsData[]
	exchanges: PortfolioExchangeStatsData[]
}
