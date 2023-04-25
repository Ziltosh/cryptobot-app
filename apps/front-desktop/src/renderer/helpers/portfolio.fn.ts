import {
	PortfolioLocalDB,
	PortfolioTokensLocalDB,
	StatsData,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import { BlockchainDB, ExchangeDB, TokenDB } from '@cryptobot/shared/src/prisma-types/db-api/DB.types'
import { cleanTokenApiData } from '@cryptobot/shared/src/helpers/portfolio.fn'
import { clear, first, insert, one, update } from 'blinkdb'
import {
	portfolioExchangeBalanceTable,
	portfolioExchangeTable,
	portfolioLogsTable,
	portfolioStatsTable,
	portfolioTable,
	portfolioTokenTable,
	portfolioTokenTransactionTable,
	portfolioWalletTable,
	portfolioWalletTransactionTable,
} from '@cryptobot/shared/src/blink/Portfolio'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'

export const importPortfolio = async ({ portfolio }: { portfolio: PortfolioLocalDB }): Promise<void> => {
	const portfolioDb = await window.localDbApi.getPortfolio({ portfolioId: portfolio.id })

	await clear(portfolioTokenTable)
	await clear(portfolioWalletTable)
	await clear(portfolioWalletTransactionTable)
	await clear(portfolioTokenTransactionTable)
	await clear(portfolioTokenTable)
	await clear(portfolioExchangeTable)
	await clear(portfolioExchangeBalanceTable)
	await clear(portfolioStatsTable)

	await update(portfolioTable, { id: portfolio.id, _emplacement: 'local', isUpdating: portfolioDb.isUpdating })

	await insert(portfolioLogsTable, {
		id: generateId(10),
		message: 'Chargement du portfolio...',
	})

	const { PortfolioTokens: portfolioTokens } = portfolioDb
	const portfolioTokensToAdd: PortfolioTokensLocalDB[] = []

	const blockchainAssociation: Record<string, BlockchainDB> = {}
	const exchangeAssociation: Record<string, ExchangeDB> = {}

	await insert(portfolioLogsTable, {
		id: generateId(10),
		message: 'Téléchargement des tokens...',
	})

	let indexToken = 1
	for (const portfolioToken of portfolioTokens) {
		await insert(portfolioLogsTable, {
			id: generateId(10),
			message: `Téléchargement du token ${indexToken} / ${portfolioTokens.length}`,
		})

		let tokenApiDb
		const tokenApi = await window.localDbApi.getTokenApi({ apiTokenId: portfolioToken.api_token_id })

		if (tokenApi) {
			tokenApiDb = JSON.parse(tokenApi.data)
		}

		if (!tokenApi) {
			tokenApiDb = (await window.dbApi.getToken({ tokenId: portfolioToken.api_token_id })) as TokenDB

			tokenApiDb = cleanTokenApiData(tokenApiDb)

			await window.localDbApi.createTokenApi({ apiToken: tokenApiDb, portfolioTokenId: portfolioToken.id })

			indexToken++
		}

		portfolioTokensToAdd.push({
			portfolio_id: portfolioDb.id,
			_tokenApiData: tokenApiDb,
			id: portfolioToken.id,
			api_token_id: portfolioToken.api_token_id,
			updatedAt: portfolioToken.updatedAt,
		})

		for (const tokenTransaction of portfolioToken.TokenTransactions) {
			let blockchainApiDb: BlockchainDB | undefined = undefined
			if (tokenTransaction.BlockchainOrigine?.api_blockchain_id) {
				if (!blockchainAssociation[tokenTransaction.BlockchainOrigine.api_blockchain_id]) {
					blockchainAssociation[tokenTransaction.BlockchainOrigine.api_blockchain_id] =
						await window.dbApi.getBlockchain({
							blockchainId: tokenTransaction.BlockchainOrigine.api_blockchain_id,
						})
					blockchainApiDb = blockchainAssociation[tokenTransaction.BlockchainOrigine.api_blockchain_id]
				} else {
					blockchainApiDb = blockchainAssociation[tokenTransaction.BlockchainOrigine.api_blockchain_id]
				}
			}

			let exchangeApiDb: ExchangeDB | undefined = undefined
			if (tokenTransaction.ExchangeOrigine?.api_exchange_id) {
				if (!exchangeAssociation[tokenTransaction.ExchangeOrigine.api_exchange_id]) {
					exchangeAssociation[tokenTransaction.ExchangeOrigine.api_exchange_id] =
						await window.dbApi.getExchange({
							exchangeId: tokenTransaction.ExchangeOrigine.api_exchange_id,
						})
					exchangeApiDb = exchangeAssociation[tokenTransaction.ExchangeOrigine.api_exchange_id]
				} else {
					exchangeApiDb = exchangeAssociation[tokenTransaction.ExchangeOrigine.api_exchange_id]
				}
			}

			await insert(portfolioTokenTransactionTable, {
				...tokenTransaction,
				portfolio_token_id: portfolioToken.id,
				_isNew: false,
				_apiTokenId: tokenApiDb.id,
				date: tokenTransaction.date * 1000,
				_isValidated: true,
				_blockchainData: blockchainApiDb,
				_exchangeData: exchangeApiDb,
			})
		}
	}

	for (const wallet of portfolioDb.PortfolioWallets) {
		await insert(portfolioWalletTable, wallet)

		for (const walletTransaction of wallet.WalletTransactions) {
			// for (const walletTransaction of bcTransactions) {
			let blockchainApiDb: BlockchainDB
			if (!blockchainAssociation[walletTransaction.BlockchainOrigine.api_blockchain_id]) {
				blockchainAssociation[walletTransaction.BlockchainOrigine.api_blockchain_id] =
					await window.dbApi.getBlockchain({
						blockchainId: walletTransaction.BlockchainOrigine.api_blockchain_id,
					})
				blockchainApiDb = blockchainAssociation[walletTransaction.BlockchainOrigine.api_blockchain_id]
			} else {
				blockchainApiDb = blockchainAssociation[walletTransaction.BlockchainOrigine.api_blockchain_id]
			}

			await insert(portfolioWalletTransactionTable, {
				...walletTransaction,
				_blockchainData: blockchainApiDb,
				date: walletTransaction.date * 1000,
			})
		}
	}

	for (const portfolioExchange of portfolioDb.PortfolioExchanges) {
		const exchangeLocalDb = await window.localDbApi.getExchangeApi({ exchangeId: portfolioExchange.exchange_id })
		console.log('exchangeLocalDb', exchangeLocalDb, 'exchange', portfolioExchange)
		const exchangeApiDb = await window.dbApi.getExchange({
			exchangeId: exchangeLocalDb.api_exchange_id,
		})

		await insert(portfolioExchangeTable, { ...portfolioExchange, _exchangeData: exchangeApiDb })

		for (const exchangeBalance of portfolioExchange.ExchangeBalances) {
			let exchangeApiDb: ExchangeDB | undefined = undefined
			if (exchangeBalance.ExchangeOrigine?.api_exchange_id) {
				if (!exchangeAssociation[exchangeBalance.ExchangeOrigine.api_exchange_id]) {
					exchangeAssociation[exchangeBalance.ExchangeOrigine.api_exchange_id] =
						await window.dbApi.getExchange({
							exchangeId: exchangeBalance.ExchangeOrigine.api_exchange_id,
						})
					exchangeApiDb = exchangeAssociation[exchangeBalance.ExchangeOrigine.api_exchange_id]
				} else {
					exchangeApiDb = exchangeAssociation[exchangeBalance.ExchangeOrigine.api_exchange_id]
				}
			}

			if (!exchangeApiDb) {
				continue
			}

			await insert(portfolioExchangeBalanceTable, {
				...exchangeBalance,
				_exchangeData: exchangeApiDb,
				date: exchangeBalance.date * 1000,
			})
		}
	}

	for (const t of portfolioTokensToAdd) {
		await insert(portfolioTokenTable, t)
	}

	if (portfolioDb.PortfolioStats.length > 0) {
		await insert(portfolioStatsTable, portfolioDb.PortfolioStats[0])
		const stats = JSON.parse(portfolioDb.PortfolioStats[0].data) as StatsData
		for (let i = 0; i < stats.tokens.length; i++) {
			const token = stats.tokens[i]

			console.log('on cherche le token', token.name, 'dans les', stats.blockchains.length, 'blockchains')

			for (let b = 0; b < stats.blockchains.length; b++) {
				const blockchain = stats.blockchains[b]
				const indexTokenInBlockchain = blockchain.tokens.findIndex((t) => t.id === token.id)
				if (indexTokenInBlockchain >= 0) {
					console.log('get blockchain', blockchain.api_blockchain_id)
					const blockchainApiDb = await window.dbApi.getBlockchain({
						blockchainId: blockchain.api_blockchain_id,
					})
					if (!blockchainApiDb) continue

					if (!stats.tokens[i]._blockchains) stats.tokens[i]._blockchains = []
					if (!stats.blockchains[b].tokens[indexTokenInBlockchain]._blockchains)
						stats.blockchains[b].tokens[indexTokenInBlockchain]._blockchains = []
					stats.tokens[i]._blockchains!.push(blockchainApiDb)
					stats.blockchains[b].tokens[indexTokenInBlockchain]._blockchains = [blockchainApiDb]

					for (let j = 0; j < stats.wallets.length; j++) {
						const wallet = stats.wallets[j]
						for (let k = 0; k < wallet.tokens.length; k++) {
							const tokenInWallet = wallet.tokens[k]
							if (tokenInWallet.id === token.id) {
								if (!stats.wallets[j].tokens[k]._blockchains)
									stats.wallets[j].tokens[k]._blockchains = []
								stats.wallets[j].tokens[k]._blockchains!.push(blockchainApiDb)
							}
						}
					}
				}
			}

			for (let e = 0; e < stats.exchanges.length; e++) {
				const exchange = stats.exchanges[e]
				const indexTokenInExchange = exchange.tokens.findIndex((t) => t.id === token.id)
				if (indexTokenInExchange >= 0) {
					console.log('get exchange', exchange.api_exchange_id)
					const exchangeApiDb = await window.dbApi.getExchange({
						exchangeId: exchange.api_exchange_id,
					})
					if (!exchangeApiDb) continue

					if (!stats.tokens[i]._exchanges) stats.tokens[i]._exchanges = []
					if (!stats.exchanges[e].tokens[indexTokenInExchange]._exchanges)
						stats.exchanges[e].tokens[indexTokenInExchange]._exchanges = []
					stats.tokens[i]._exchanges!.push(exchangeApiDb)
					stats.exchanges[e].tokens[indexTokenInExchange]._exchanges = [exchangeApiDb]

					for (let j = 0; j < stats.wallets.length; j++) {
						const wallet = stats.wallets[j]
						for (let k = 0; k < wallet.tokens.length; k++) {
							const tokenInWallet = wallet.tokens[k]
							if (tokenInWallet.id === token.id) {
								if (!stats.wallets[j].tokens[k]._exchanges) stats.wallets[j].tokens[k]._exchanges = []
								stats.wallets[j].tokens[k]._exchanges!.push(exchangeApiDb)
							}
						}
					}
				}
			}
		}
		await update(portfolioStatsTable, {
			id: portfolioDb.PortfolioStats[0].id,
			data: JSON.stringify(stats),
		})
	}

	console.log(`=======`)
	console.log(`Fin import portfolio ${portfolioDb.name}`)
}

export const getStableVolatileRatio = async (): Promise<{ stablecoin: number; volatile: number }> => {
	let stablecoin = 0
	let volatile = 0
	// On parcourt les transactions

	const portfolioCurrent = await one(portfolioTable, {
		where: {
			_isCurrent: true,
		},
	})

	const stats = await first(portfolioStatsTable, {
		where: {
			portfolio_id: portfolioCurrent.id,
		},
	})

	if (!stats) return { stablecoin, volatile }

	for (const token of (JSON.parse(stats.data) as StatsData).tokens) {
		const tokenFind = await one(portfolioTokenTable, {
			where: {
				id: token.id,
			},
		})
		if (
			tokenFind?._tokenApiData?.custom_data.is_usd_stablecoin ||
			tokenFind?._tokenApiData?.custom_data.is_eur_stablecoin
		) {
			stablecoin += token.valeurActuelle
		} else {
			volatile += token.valeurActuelle
		}
	}

	stablecoin = Math.abs(stablecoin)
	volatile = Math.abs(volatile)

	return {
		stablecoin,
		volatile,
	}
}

export const getCexOnchainRatio = async (): Promise<{ cex: number; onchain: number }> => {
	let cex = 0
	let onchain = 0
	// On parcourt les transactions

	const portfolioCurrent = await one(portfolioTable, {
		where: {
			_isCurrent: true,
		},
	})

	const stats = await first(portfolioStatsTable, {
		where: {
			portfolio_id: portfolioCurrent.id,
		},
	})

	if (!stats) return { cex, onchain }

	for (const exchange of (JSON.parse(stats.data) as StatsData).exchanges) {
		cex += exchange.valeurActuelle
	}

	for (const blockchain of (JSON.parse(stats.data) as StatsData).blockchains) {
		onchain += blockchain.valeurActuelle
	}

	onchain = Math.abs(onchain)
	cex = Math.abs(cex)

	return {
		cex,
		onchain,
	}
}

export const getDefiWalletRatio = async (): Promise<{ defi: number; wallet: number }> => {
	let defi = 0
	let wallet = 0
	// On parcourt les transactions

	const portfolioCurrent = await one(portfolioTable, {
		where: {
			_isCurrent: true,
		},
	})

	const stats = await first(portfolioStatsTable, {
		where: {
			portfolio_id: portfolioCurrent.id,
		},
	})

	if (!stats) return { defi, wallet }

	for (const token of (JSON.parse(stats.data) as StatsData).tokens) {
		wallet += token.valeurActuelle
	}

	wallet = Math.abs(wallet)
	defi = Math.abs(defi)

	return {
		defi,
		wallet,
	}
}
