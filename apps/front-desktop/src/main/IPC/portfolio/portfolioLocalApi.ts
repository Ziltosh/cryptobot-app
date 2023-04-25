import { dbUserPath, Migration } from '../../prisma/vars'
import { Portfolio, PrismaClient } from '.prisma/client'
import {
	createExchanges,
	createTokens,
	createTransactionsAndTransfers,
	createWallets,
} from './portfolioLocalApiHelpers'
import {
	ExchangeLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWithAllLocalDB,
	PortfolioWithStatsLocalDB,
	TokenApiLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { TokenDB } from '@cryptobot/shared/src/prisma-types/db-api/DB.types'

export const localApiGetPortfolios = async ({
	localPrisma,
}: {
	localPrisma: PrismaClient
}): Promise<PortfolioWithStatsLocalDB[]> => {
	return localPrisma.portfolio.findMany({
		include: {
			PortfolioStats: {
				orderBy: {
					date: 'desc',
				},
				take: 1,
			},
		},
	})
}

export const localApiGetPortfolio = async ({
	localPrisma,
	portfolioId,
}: {
	localPrisma: PrismaClient
	portfolioId: string
}): Promise<PortfolioWithAllLocalDB | null> => {
	const portfolio = await localPrisma.portfolio.findFirst({
		where: {
			id: portfolioId,
		},
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
			PortfolioExchanges: {
				include: {
					ExchangeBalances: {
						include: {
							ExchangeOrigine: true,
						},
					},
				},
			},
			PortfolioWallets: {
				include: {
					WalletTransactions: {
						include: {
							BlockchainOrigine: true,
						},
					},
				},
			},
			PortfolioStats: {
				orderBy: {
					date: 'desc',
				},
				take: 1,
			},
		},
	})

	// console.log('localApiGetPortfolio', JSON.stringify(portfolio, null, 2))

	return portfolio
}

export const localApiCreatePortfolio = async ({
	localPrisma,
	portfolioData,
	tokenTransactionsData,
	tokensData,
	walletsData,
	exchangesData,
}: {
	localPrisma: PrismaClient
	portfolioData: PortfolioLocalDB
	tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
	tokensData: PortfolioTokensLocalDB[]
	walletsData: PortfolioWalletsLocalDB[]
	exchangesData: PortfolioExchangesLocalDB[]
}): Promise<Portfolio> => {
	// const transactions = JSON.parse(jsonTransactions) as PortfolioTransaction[]
	// console.log('portfolioData', portfolioData)
	// console.log('customTransactionsData', customTransactionsData)
	// console.log('tokensData', tokensData)
	// console.log('walletsData', walletsData)

	const newPortfolio = await localPrisma.portfolio.create({
		data: {
			name: portfolioData.name,
		},
	})

	await createTokens({
		portfolio: newPortfolio,
		localPrisma: localPrisma,
		portfolioTokens: tokensData,
	})

	await createTransactionsAndTransfers({
		portfolio: newPortfolio,
		localPrisma: localPrisma,
		tokenTransactions: tokenTransactionsData,
	})

	await createWallets({
		portfolio: newPortfolio,
		localPrisma: localPrisma,
		wallets: walletsData,
	})

	await createExchanges({
		portfolio: newPortfolio,
		localPrisma: localPrisma,
		exchanges: exchangesData,
	})

	return newPortfolio
}

export const localApiEditPortfolio = async ({
	localPrisma,
	portfolioData,
	tokenTransactionsData,
	portfolioTokensData,
	walletsData,
	exchangesData,
}: {
	localPrisma: PrismaClient
	portfolioData: PortfolioLocalDB
	tokenTransactionsData: PortfolioTokenTransactionsLocalDB[]
	portfolioTokensData: PortfolioTokensLocalDB[]
	walletsData: PortfolioWalletsLocalDB[]
	exchangesData: PortfolioExchangesLocalDB[]
}): Promise<Portfolio> => {
	// const transactions = JSON.parse(jsonTransactions) as PortfolioTransaction[]

	// console.log('portfolioData', portfolioData)
	// console.log('tokenTransactionsData', tokenTransactionsData)
	// console.log('tokensData', tokensData)
	// console.log('walletsData', walletsData)

	const portfolioDb = await localPrisma.portfolio.findUnique({
		where: {
			id: portfolioData.id,
		},
	})

	if (!portfolioDb) {
		throw new Error('Portfolio not found')
	}

	await localPrisma.portfolio.update({
		where: {
			id: portfolioDb.id,
		},
		data: {
			name: portfolioData.name,
		},
	})

	// On supprime tout
	await localPrisma.portfolioToken.deleteMany({
		where: {
			id: {
				notIn: portfolioTokensData.map((token) => token.id),
			},
			portfolio_id: portfolioDb.id,
		},
	})

	await localPrisma.portfolioWallet.deleteMany({
		where: {
			id: {
				notIn: walletsData.map((wallet) => wallet.id),
			},
			portfolio_id: portfolioDb.id,
		},
	})

	await localPrisma.portfolioExchange.deleteMany({
		where: {
			id: {
				notIn: exchangesData.map((exchange) => exchange.id),
			},
			portfolio_id: portfolioDb.id,
		},
	})

	await createTokens({
		portfolio: portfolioDb,
		localPrisma: localPrisma,
		portfolioTokens: portfolioTokensData,
	})

	await createTransactionsAndTransfers({
		portfolio: portfolioDb,
		localPrisma: localPrisma,
		tokenTransactions: tokenTransactionsData,
	})

	await createWallets({
		portfolio: portfolioDb,
		localPrisma: localPrisma,
		wallets: walletsData,
	})

	await createExchanges({
		portfolio: portfolioDb,
		localPrisma: localPrisma,
		exchanges: exchangesData,
	})

	return portfolioDb
}

export const localApiGetTokenApi = async ({
	localPrisma,
	apiTokenId,
}: {
	localPrisma: PrismaClient
	apiTokenId: string
}): Promise<TokenApiLocalDB | null> => {
	const tokenApiDb = await localPrisma.tokenApi.findUnique({
		where: {
			api_token_id: apiTokenId,
		},
	})
	return tokenApiDb
}

export const localApiGetExchangeApi = async ({
	localPrisma,
	exchangeId,
}: {
	localPrisma: PrismaClient
	exchangeId: string
}): Promise<ExchangeLocalDB | null> => {
	const exchangeDb = await localPrisma.exchange.findUnique({
		where: {
			id: exchangeId,
		},
	})
	return exchangeDb
}

export const localApiCreateTokenApi = async ({
	localPrisma,
	apiToken,
	portfolioTokenId,
}: {
	localPrisma: PrismaClient
	apiToken: TokenDB
	portfolioTokenId: string
}): Promise<void> => {
	await localPrisma.tokenApi.create({
		data: {
			data: JSON.stringify(apiToken),
			api_token_id: apiToken.id,
			portfolio_token_id: portfolioTokenId,
			updatedAt: new Date(),
		},
	})
}

export const localApiDeletePortfolio = async ({
	localPrisma,
	portfolioId,
}: {
	localPrisma: PrismaClient
	portfolioId: string
}): Promise<void> => {
	await localPrisma.portfolio.delete({
		where: {
			id: portfolioId,
		},
		include: {
			PortfolioStats: true,
			PortfolioWallets: {
				include: {
					WalletTransactions: true,
				},
			},
			PortfolioExchanges: true,
			PortfolioTokens: {
				include: {
					TokenTransactions: true,
				},
			},
		},
	})
}

export const localApiGetLastMigration = async (localPrisma: PrismaClient): Promise<string> => {
	// Pour check les migrations, c'est avec la version "locale"
	const latest: Migration[] = await localPrisma.$queryRaw`select * from _prisma_migrations order by finished_at`
	return latest[latest.length - 1]?.migration_name
}

export const localApiGetDbLocation = async (): Promise<string> => {
	return dbUserPath
}
