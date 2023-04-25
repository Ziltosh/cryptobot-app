import { PrismaClient } from '.prisma/client'
import {
	PortfolioExchangesLocalDB,
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'

export const createTokens = async ({
	portfolioTokens,
	portfolio,
	localPrisma,
}: {
	portfolioTokens: PortfolioTokensLocalDB[]
	portfolio: PortfolioLocalDB
	localPrisma: PrismaClient
}): Promise<void> => {
	for (const portfolioToken of portfolioTokens) {
		const portfolioTokenExists = await localPrisma.portfolioToken.findFirst({
			where: {
				api_token_id: portfolioToken._tokenApiData.id,
				portfolio_id: portfolio.id,
			},
		})

		if (!portfolioTokenExists) {
			await localPrisma.portfolioToken.create({
				data: {
					portfolio_id: portfolio.id,
					api_token_id: portfolioToken._tokenApiData.id,
				},
			})
		}
	}
}

export const createTransactionsAndTransfers = async ({
	tokenTransactions,
	portfolio,
	localPrisma,
}: {
	tokenTransactions: PortfolioTokenTransactionsLocalDB[]
	portfolio: PortfolioLocalDB
	localPrisma: PrismaClient
}): Promise<void> => {
	for (const transaction of tokenTransactions) {
		let blockchainDB, exchangeDB

		const transactionExists = await localPrisma.tokenTransaction.findUnique({
			where: {
				id: transaction.id,
			},
		})

		if (transactionExists) {
			continue
		}

		const portfolioTokenDb = await localPrisma.portfolioToken.findFirst({
			where: {
				api_token_id: transaction._apiTokenId,
				portfolio_id: portfolio.id,
			},
		})

		if (!portfolioTokenDb) {
			throw new Error('Portfolio token not found')
		}

		if (transaction._blockchainData && transaction.blockchain_id) {
			blockchainDB = await localPrisma.blockchain.findFirst({
				where: {
					api_blockchain_id: transaction._blockchainData.id,
				},
			})

			if (!blockchainDB) {
				blockchainDB = await localPrisma.blockchain.create({
					data: {
						api_blockchain_id: transaction._blockchainData.id,
					},
				})
			}

			console.log('création', {
				date: Math.ceil(transaction.date / 1000),
				prix: transaction.prix,
				quantite: transaction.quantite,
				fee_quantite: 0,
				blockchain_id: blockchainDB.id,
				portfolio_token_id: portfolioTokenDb.id,
				type: transaction.type,
			})

			await localPrisma.tokenTransaction.create({
				data: {
					date: Math.ceil(transaction.date / 1000),
					prix: transaction.prix,
					quantite: transaction.quantite,
					fee_quantite: 0,
					blockchain_id: blockchainDB.id,
					portfolio_token_id: portfolioTokenDb.id,
					type: transaction.type,
				},
			})
		} else if (transaction._exchangeData && transaction.exchange_id) {
			exchangeDB = await localPrisma.exchange.findFirst({
				where: {
					api_exchange_id: transaction._exchangeData.id,
				},
			})

			if (!exchangeDB) {
				exchangeDB = await localPrisma.exchange.create({
					data: {
						api_exchange_id: transaction._exchangeData.id,
						updatedAt: new Date(),
					},
				})
			}

			await localPrisma.tokenTransaction.create({
				data: {
					date: Math.ceil(transaction.date / 1000),
					prix: transaction.prix,
					quantite: transaction.quantite,
					fee_quantite: 0,
					exchange_id: exchangeDB.id,
					portfolio_token_id: portfolioTokenDb.id,
					type: transaction.type,
				},
			})
		}
	}
}

export const createWallets = async ({
	wallets,
	portfolio,
	localPrisma,
}: {
	wallets: PortfolioWalletsLocalDB[]
	portfolio: PortfolioLocalDB
	localPrisma: PrismaClient
}): Promise<void> => {
	for (const wallet of wallets) {
		let walletDb = await localPrisma.portfolioWallet.findFirst({
			where: {
				address: wallet.address,
				portfolio_id: portfolio.id,
			},
		})

		if (!walletDb) {
			walletDb = await localPrisma.portfolioWallet.create({
				data: {
					address: wallet.address,
					name: wallet.name,
					portfolio_id: portfolio.id,
				},
			})
		} else {
			await localPrisma.portfolioWallet.update({
				where: {
					id: walletDb.id,
				},
				data: {
					name: wallet.name,
					Portfolio: {
						connect: {
							id: portfolio.id,
						},
					},
				},
			})
		}
	}
}

export const createExchanges = async ({
	exchanges,
	portfolio,
	localPrisma,
}: {
	exchanges: PortfolioExchangesLocalDB[]
	portfolio: PortfolioLocalDB
	localPrisma: PrismaClient
}): Promise<void> => {
	for (const exchange of exchanges) {
		let exchangeDb = await localPrisma.exchange.findFirst({
			where: {
				api_exchange_id: exchange._exchangeData.id,
			},
		})

		if (!exchangeDb) {
			exchangeDb = await localPrisma.exchange.create({
				data: {
					api_exchange_id: exchange._exchangeData.id,
					updatedAt: new Date(),
				},
			})
		}

		let portfolioExchangeDb = await localPrisma.portfolioExchange.findFirst({
			where: {
				nom: exchange.nom,
				portfolio_id: portfolio.id,
				exchange_id: exchangeDb.id,
			},
		})

		if (!portfolioExchangeDb) {
			portfolioExchangeDb = await localPrisma.portfolioExchange.create({
				data: {
					nom: exchange.nom,
					portfolio_id: portfolio.id,
					exchange_id: exchangeDb.id,
					api_data: exchange.api_data,
					updatedAt: new Date(),
				},
			})
		} else {
			await localPrisma.portfolioExchange.update({
				where: {
					id: portfolioExchangeDb.id,
				},
				data: {
					nom: exchange.nom,
					Portfolio: {
						connect: {
							id: portfolio.id,
						},
					},
				},
			})
		}
	}
}
