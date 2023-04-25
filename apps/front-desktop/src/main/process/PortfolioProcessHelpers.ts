import { dbApiGetNativeBlockchainToken, dbApiGetToken } from '@cryptobot/shared/src/front-desktop/main/process/dbApi.fn'
import {
	PortfolioExchangesMessageResponse,
	PortfolioWalletsMessageResponse,
} from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'
import { PrismaClient } from '.prisma/client'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

export const processTraiterEVMTransactionsNormal = async ({
	transactions,
	prisma,
	portfolio_id,
}: {
	transactions: PortfolioWalletsMessageResponse['data']['evmNormalTransactions']
	prisma: PrismaClient
	portfolio_id: string
}): Promise<void> => {
	for (const transaction of transactions) {
		if (transaction.is_error) {
			continue
		}

		// if (transaction.hash === '0x758a41083f4fb9577a2b974109108d4da745584b14b0be5f84a0f9dbba8cac7e')
		// 	console.log('transaction', transaction)

		const transactionExist = await prisma.walletTransaction.findFirst({
			where: {
				date: transaction.date,
				hash: transaction.hash,
				type_transaction: 'normal',
				type: transaction.sens,
				portfolio_wallet_id: transaction._portfolio_wallet_id,
				quantite: transaction.quantite,
				from: transaction.from.toLowerCase(),
				to: transaction.to.toLowerCase(),
			},
		})

		// if (transaction.hash === '0x758a41083f4fb9577a2b974109108d4da745584b14b0be5f84a0f9dbba8cac7e')
		// 	console.log('transaction exist', transactionExist)

		if (transactionExist) {
			continue
		}

		const tokenNatif = await dbApiGetNativeBlockchainToken({
			blockchain_id: transaction.blockchain_id,
		})

		if (!tokenNatif) {
			console.log('token natif non trouvé', transaction)
			throw new Error('token natif non trouvé')
		}

		const portfolioTokenDb = await prisma.portfolioToken.findFirst({
			where: {
				api_token_id: tokenNatif.id,
				portfolio_id: portfolio_id,
			},
		})

		if (!portfolioTokenDb) {
			throw new Error('portfolio token non trouvé')
		}

		let blockchainDb = await prisma.blockchain.findUnique({
			where: {
				api_blockchain_id: transaction.blockchain_id,
			},
		})

		if (!blockchainDb) {
			blockchainDb = await prisma.blockchain.create({
				data: {
					api_blockchain_id: transaction.blockchain_id,
				},
			})
		}

		if (!transactionExist) {
			await prisma.walletTransaction.create({
				data: {
					date: transaction.date,
					hash: transaction.hash,
					from: transaction.from.toLowerCase(),
					to: transaction.to.toLowerCase(),
					block_number: transaction.block_number,
					quantite: transaction.quantite,
					fee_quantite: transaction.fee_quantite,
					prix: transaction.prix,
					type: transaction.sens,
					is_error: transaction.is_error,
					blockchain_id: blockchainDb.id,
					portfolio_wallet_id: transaction._portfolio_wallet_id,
					token_natif_prix: transaction.prix,
					portfolio_token_id: portfolioTokenDb.id,
					type_transaction: 'normal',
				},
			})
		}
	}
}

export const processTraiterEVMTransactionsInternal = async ({
	transactions,
	prisma,
	portfolio_id,
}: {
	transactions: PortfolioWalletsMessageResponse['data']['evmInternalTransactions']
	prisma: PrismaClient
	portfolio_id: string
}): Promise<void> => {
	for (const transaction of transactions) {
		if (transaction.is_error) {
			continue
		}
		// On vérifie si une transaction normale avec les mêmes infos existe déjà
		const transactionExist = await prisma.walletTransaction.findFirst({
			where: {
				hash: transaction.hash,
				type_transaction: 'internal',
				portfolio_wallet_id: transaction._portfolio_wallet_id,
				quantite: transaction.quantite,
				from: transaction.from,
				to: transaction.to,
			},
		})

		if (transactionExist) {
			continue
		}

		const tokenNatif = await dbApiGetNativeBlockchainToken({
			blockchain_id: transaction.blockchain_id,
		})

		if (!tokenNatif) {
			throw new Error('token natif non trouvé')
		}

		const portfolioTokenDb = await prisma.portfolioToken.findFirst({
			where: {
				api_token_id: tokenNatif.id,
				portfolio_id: portfolio_id,
			},
		})

		if (!portfolioTokenDb) {
			throw new Error('portfolio token non trouvé')
		}

		let blockchainDb = await prisma.blockchain.findUnique({
			where: {
				api_blockchain_id: transaction.blockchain_id,
			},
		})

		if (!blockchainDb) {
			blockchainDb = await prisma.blockchain.create({
				data: {
					api_blockchain_id: transaction.blockchain_id,
				},
			})
		}

		if (!transactionExist) {
			await prisma.walletTransaction.create({
				data: {
					date: transaction.date,
					hash: transaction.hash,
					from: transaction.from.toLowerCase(),
					to: transaction.to.toLowerCase(),
					block_number: transaction.block_number,
					quantite: transaction.quantite,
					fee_quantite: 0,
					type: transaction.sens,
					prix: transaction.prix,
					is_error: transaction.is_error,
					blockchain_id: blockchainDb.id,
					portfolio_wallet_id: transaction._portfolio_wallet_id,
					token_natif_prix: transaction.prix,
					portfolio_token_id: portfolioTokenDb.id,
					type_transaction: 'internal',
				},
			})
		}
	}
}

export const processTraiterEVMTransactionsERC20 = async ({
	transactions,
	prisma,
	portfolio_id,
}: {
	transactions: PortfolioWalletsMessageResponse['data']['evmERC20Transactions']
	prisma: PrismaClient
	portfolio_id: string
}): Promise<void> => {
	for (const transaction of transactions) {
		const transactionExist = await prisma.walletTransaction.findFirst({
			where: {
				hash: transaction.hash,
				type_transaction: 'erc20',
				type: transaction.sens,
				portfolio_wallet_id: transaction._portfolio_wallet_id,
				quantite: transaction.quantite,
				from: transaction.from.toLowerCase(),
				to: transaction.to.toLowerCase(),
			},
		})

		if (transactionExist) {
			continue
		}

		const tokenNatif = await dbApiGetNativeBlockchainToken({
			blockchain_id: transaction.blockchain_id,
		})

		if (!tokenNatif) {
			console.log('token natif non trouvé', transaction)
			throw new Error('token natif non trouvé' + JSON.stringify(transaction))
		}

		const tokenErc20 = await dbApiGetToken({
			tokenId: transaction.token_id,
		})

		if (!tokenErc20) {
			console.log('token erc20 non trouvé', transaction)
			throw new Error('token erc20 non trouvé')
		}

		let portfolioTokenDb = await prisma.portfolioToken.findFirst({
			where: {
				api_token_id: tokenErc20.id,
				portfolio_id: portfolio_id,
			},
		})

		if (!portfolioTokenDb) {
			portfolioTokenDb = await prisma.portfolioToken.create({
				data: {
					api_token_id: tokenErc20.id,
					portfolio_id: portfolio_id,
				},
			})
		}

		let blockchainDb = await prisma.blockchain.findUnique({
			where: {
				api_blockchain_id: transaction.blockchain_id,
			},
		})

		if (!blockchainDb) {
			blockchainDb = await prisma.blockchain.create({
				data: {
					api_blockchain_id: transaction.blockchain_id,
				},
			})
		}

		if (!transactionExist) {
			// On regarde si on n'a pas une transaction avec le même hash dans les transactions normales (quantite a 0)
			// car ça voudrait dire que l'on a déjà traité les fees, dans ce cas on prend la plus grosse fee des 2 transactions
			const transactionNormaleExist = await prisma.walletTransaction.findFirst({
				where: {
					hash: transaction.hash,
					type_transaction: 'normal',
				},
			})

			await prisma.walletTransaction
				.create({
					data: {
						date: transaction.date,
						hash: transaction.hash,
						from: transaction.from.toLowerCase(),
						to: transaction.to.toLowerCase(),
						block_number: transaction.block_number,
						quantite: transaction.quantite,
						fee_quantite: transactionNormaleExist
							? Math.max(transaction.fee_quantite, transactionNormaleExist.fee_quantite)
							: transaction.fee_quantite,
						prix: transaction.prix,
						type: transaction.sens,
						is_error: false,
						blockchain_id: blockchainDb.id,
						portfolio_wallet_id: transaction._portfolio_wallet_id,
						token_natif_prix: transaction.token_natif_prix,
						portfolio_token_id: portfolioTokenDb.id,
						type_transaction: 'erc20',
					},
				})
				.catch((e) => {
					console.log(e)
				})
		}
	}
}

export const processTraiterExchangeBalances = async ({
	balances,
	tokens,
	portfolio_id,
	prisma,
}: {
	balances: PortfolioExchangesMessageResponse['data']['balances']
	tokens: PortfolioExchangesMessageResponse['data']['portfolioTokens']
	prisma: PrismaClient
	portfolio_id: string
}): Promise<void> => {
	for (const transaction of balances) {
		const portfolioTokenDb = await prisma.portfolioToken.findFirst({
			where: {
				api_token_id: tokens.find((t) => t.id === transaction.portfolio_token_id)?.api_token_id,
				portfolio_id: portfolio_id,
			},
		})

		if (!portfolioTokenDb) {
			throw new Error('portfolioTokenDb not found')
		}

		const lastBalance = await prisma.exchangeBalance.findFirst({
			where: {
				portfolio_token_id: portfolioTokenDb.id,
				portfolio_exchange_id: transaction.portfolio_exchange_id,
				exchange_id: transaction.exchange_id,
			},
			orderBy: {
				date: 'desc',
			},
		})

		let sens = 'in'
		let diff = 0
		if (lastBalance && lastBalance.total > transaction.total) {
			sens = 'out'
			diff = lastBalance.total - transaction.total
		} else if (lastBalance && lastBalance.total < transaction.total) {
			diff = transaction.total - lastBalance.total
		} else if (!lastBalance) {
			diff = transaction.total
		} else {
			diff = 0
		}

		await prisma.exchangeBalance
			.create({
				data: {
					date: transaction.date,
					prix: transaction.prix,
					type: sens,
					total: transaction.total,
					diff: diff,
					fee_quantite: transaction.fee_quantite,
					portfolio_exchange_id: transaction.portfolio_exchange_id,
					portfolio_token_id: portfolioTokenDb.id,
					exchange_id: transaction.exchange_id,
					updatedAt: new Date(),
				},
			})
			.catch((e) => {
				console.log(e)
				console.log({
					date: transaction.date,
					prix: transaction.prix,
					type: sens,
					total: transaction.total,
					diff: diff,
					fee_quantite: transaction.fee_quantite,
					portfolio_exchange_id: transaction.portfolio_exchange_id,
					portfolio_token_id: portfolioTokenDb.id,
					exchange_id: transaction.exchange_id,
					updatedAt: new Date(),
				})
				throw e
			})
	}
}

export const processTraiterWalletBalance = async ({
	balances,
	portfolio_id,
	prisma,
}: {
	balances: PortfolioWalletsMessageResponse['data']['evmBalanceTransactions']
	prisma: PrismaClient
	portfolio_id: string
}): Promise<void> => {
	for (const balance of balances) {
		const tokenNatif = await dbApiGetNativeBlockchainToken({
			blockchain_id: balance.blockchain_id,
		})

		if (!tokenNatif) {
			console.log('token natif non trouvé', balances)
			throw new Error('token natif non trouvé')
		}

		const portfolioTokenDb = await prisma.portfolioToken.findFirst({
			where: {
				api_token_id: tokenNatif.id,
				portfolio_id: portfolio_id,
			},
		})

		if (!portfolioTokenDb) {
			throw new Error('portfolio token non trouvé')
		}

		let blockchainDb = await prisma.blockchain.findUnique({
			where: {
				api_blockchain_id: balance.blockchain_id,
			},
		})

		if (!blockchainDb) {
			blockchainDb = await prisma.blockchain.create({
				data: {
					api_blockchain_id: balance.blockchain_id,
				},
			})
		}

		const transactionExist = await prisma.walletTransaction.findFirst({
			where: {
				type_transaction: 'balance',
				portfolio_wallet_id: balance._portfolio_wallet_id,
				to: balance.address,
				portfolio_token_id: portfolioTokenDb.id,
				date: balance.date,
			},
			orderBy: {
				date: 'desc',
			},
		})

		if (transactionExist) {
			return
		} else {
			await prisma.walletTransaction.create({
				data: {
					date: balance.date,
					hash: 'b_' + generateId(20),
					from: '',
					to: balance.address,
					block_number: 0,
					quantite: balance.quantite,
					fee_quantite: 0,
					prix: balance.prix,
					type: 'in',
					is_error: false,
					blockchain_id: blockchainDb.id,
					portfolio_wallet_id: balance._portfolio_wallet_id,
					token_natif_prix: balance.prix,
					portfolio_token_id: portfolioTokenDb.id,
					type_transaction: 'balance',
				},
			})
		}
	}
}
