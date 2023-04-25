import { BackgroundProcess } from './BackgroundProcess'
import { localApiGetPortfolios } from '../IPC/portfolio/portfolioLocalApi'
import { PrismaClient } from '.prisma/client'
import { BrowserWindow } from 'electron'
import {
	PortfolioExchangesMessageResponse,
	PortfolioExchangesMessageUpdate,
	PortfolioMessage,
	PortfolioStatsMessageUpdate,
	PortfolioWalletsMessageResponse,
	PortfolioWalletsMessageUpdate,
} from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'
import {
	PortfolioBlockchainsWithTransactionLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioExchangesWithTransactionLocalDB,
	PortfolioLocalDB,
	PortfolioTokensWithTransactionsLocalDB,
	PortfolioWalletsWithTransactionsLocalDB,
	StatsData,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import {
	processTraiterEVMTransactionsERC20,
	processTraiterExchangeBalances,
	processTraiterWalletBalance,
} from './PortfolioProcessHelpers'
import {
	dbApiGetBlockchain,
	dbApiGetExchange,
	dbApiGetToken,
} from '@cryptobot/shared/src/front-desktop/main/process/dbApi.fn'

export class PortfolioProcess extends BackgroundProcess<PortfolioMessage> {
	private readonly prisma: PrismaClient
	private portfolios: PortfolioLocalDB[] = []
	private _lockWallet = false
	private _lockExchange = false

	constructor(prismaClient: PrismaClient, userDataPath: string, window: BrowserWindow) {
		super('portfolio', userDataPath)

		this.prisma = prismaClient

		// Local
		;(async (): Promise<void> => {
			this.portfolios = await localApiGetPortfolios({ localPrisma: prismaClient })
			this.log(this.portfolios.length.toString(), 'portfolios dans la base locale')
			for (const portfolio of this.portfolios) {
				await prismaClient.portfolio.update({
					where: {
						id: portfolio.id,
					},
					data: {
						isUpdating: false,
					},
				})
			}
			// await this.actionUpdateTokens(this.portfolios)
		})()

		this.on('message', async (message: PortfolioMessage) => {
			switch (message.type) {
				case 'portfolio:log':
					{
						window.webContents.send('mainMsg:log:portfolio', message.data)
					}
					break

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				// TOKENS UPDATE RESPONSE
				////////////////////////////////////////////////////////////////////////////////////////////////////////
				case 'portfolio:stats:update:response': {
					const data = message.data as StatsData

					await this.prisma.portfolioStats.create({
						data: {
							portfolio_id: data.portfolio.id,
							evolutionPct: data.portfolio.evolutionPct,
							evolutionValue: data.portfolio.evolutionValeur,
							total: data.portfolio.valeurActuelle,
							date: Math.ceil(new Date().getTime() / 1000),
							data: JSON.stringify(data),
						},
					})

					await this.prisma.portfolio.update({
						where: {
							id: data.portfolio.id,
						},
						data: {
							isUpdating: false,
						},
					})

					window.webContents.send('mainMsg:log:portfolio', 'En attente...')

					break
				}

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				// WALLETS UPDATE RESPONSE
				////////////////////////////////////////////////////////////////////////////////////////////////////////
				case 'portfolio:wallets:update:response': {
					const data = message.data as PortfolioWalletsMessageResponse['data']

					// On enregistre tokens et transactions dans la base
					let indexToken = 1
					for (const token of data.portfolioTokens) {
						const portfolioTokenExist = await this.prisma.portfolioToken.findFirst({
							where: {
								portfolio_id: data.portfolio.id,
								api_token_id: token.api_token_id,
							},
						})
						if (!portfolioTokenExist) {
							await this.prisma.portfolioToken.create({
								data: {
									portfolio_id: data.portfolio.id,
									api_token_id: token.api_token_id,
								},
							})
						}

						window.webContents.send(
							'mainMsg:log:portfolio',
							`Enregistrement des tokens ${indexToken}/${data.portfolioTokens.length} ...`
						)
						indexToken++
					}

					window.webContents.send('mainMsg:log:portfolio', `Analyse de la balance...`)
					await processTraiterWalletBalance({
						balances: data.evmBalanceTransactions,
						portfolio_id: data.portfolio.id,
						prisma: this.prisma,
					})

					// window.webContents.send('mainMsg:log:portfolio', `Analyse des transactions normales...`)
					// await processTraiterEVMTransactionsNormal({
					// 	transactions: data.evmNormalTransactions,
					// 	portfolio_id: data.portfolio.id,
					// 	prisma: this.prisma,
					// })

					// window.webContents.send('mainMsg:log:portfolio', `Analyse des transactions internes...`)
					// await processTraiterEVMTransactionsInternal({
					// 	transactions: data.evmInternalTransactions,
					// 	portfolio_id: data.portfolio.id,
					// 	prisma: this.prisma,
					// })

					window.webContents.send('mainMsg:log:portfolio', `Analyse des transactions ERC20...`)
					await processTraiterEVMTransactionsERC20({
						transactions: data.evmERC20Transactions,
						portfolio_id: data.portfolio.id,
						prisma: this.prisma,
					})

					this._lockWallet = false

					break
				}

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				// EXCHANGES UPDATE RESPONSE
				////////////////////////////////////////////////////////////////////////////////////////////////////////
				case 'portfolio:exchanges:update:response': {
					const data = message.data as PortfolioExchangesMessageResponse['data']

					// On enregistre tokens et transactions dans la base
					let indexToken = 1
					for (const token of data.portfolioTokens) {
						const portfolioTokenExist = await this.prisma.portfolioToken.findFirst({
							where: {
								portfolio_id: data.portfolio.id,
								api_token_id: token.api_token_id,
							},
						})
						if (!portfolioTokenExist) {
							await this.prisma.portfolioToken.create({
								data: {
									portfolio_id: data.portfolio.id,
									api_token_id: token.api_token_id,
								},
							})
						}

						window.webContents.send(
							'mainMsg:log:portfolio',
							`Enregistrement des tokens ${indexToken}/${data.portfolioTokens.length} ...`
						)
						indexToken++
					}

					await processTraiterExchangeBalances({
						balances: data.balances,
						tokens: data.portfolioTokens,
						portfolio_id: data.portfolio.id,
						prisma: this.prisma,
					})

					this._lockExchange = false

					break
				}

				default: {
					/* empty */
				}
			}
		})
	}

	actionStart(): void {
		const message: PortfolioMessage = {
			type: 'action:start',
			data: 'start',
		}
		// Indique au processus de se lancer (voir le fichier portfolio.ts dans le dossier process-files)
		this.send(message)
	}

	async actionUpdateTokens(portfolios: PortfolioLocalDB[]): Promise<void> {
		this.log('----- UPDATE PORTFOLIOS TOKENS', portfolios.length.toString(), '-----')
		for (const portfolio of portfolios) {
			await this.prisma.portfolio.update({
				where: {
					id: portfolio.id,
				},
				data: {
					isUpdating: true,
				},
			})

			const portfolioDb: PortfolioLocalDB | null = await this.prisma.portfolio.findUnique({
				where: {
					id: portfolio.id,
				},
			})

			const tokens: PortfolioTokensWithTransactionsLocalDB[] = []
			const wallets: PortfolioWalletsWithTransactionsLocalDB[] = []
			const blockchains: PortfolioBlockchainsWithTransactionLocalDB[] = []
			const exchanges: PortfolioExchangesWithTransactionLocalDB[] = []

			if (!portfolioDb) {
				continue
			}

			/****** TOKENS ******/
			const portfolioTokens = await this.prisma.portfolioToken.findMany({
				where: {
					portfolio_id: portfolioDb.id,
				},
				include: {
					TokenTransactions: {
						include: {
							ExchangeOrigine: true,
							BlockchainOrigine: true,
						},
					},
					ExchangeBalances: {
						include: {
							ExchangeOrigine: true,
						},
					},
					WalletTransactions: {
						include: {
							BlockchainOrigine: true,
						},
					},
				},
			})
			for (const portfolioToken of portfolioTokens) {
				const tokenApiDb = await dbApiGetToken({ tokenId: portfolioToken.api_token_id })
				if (!tokenApiDb) {
					continue
				}

				tokens.push({
					...portfolioToken,
					_tokenApiData: tokenApiDb,
				})
			}

			/****** WALLETS ******/
			const portfolioWallets = await this.prisma.portfolioWallet.findMany({
				where: {
					portfolio_id: portfolioDb.id,
				},
				include: {
					WalletTransactions: {
						include: {
							BlockchainOrigine: true,
							PortfolioToken: true,
						},
					},
				},
			})
			wallets.push(...portfolioWallets)

			/****** BLOCKCHAINS ******/
			// On parcourt les wallet transactions et les tokens transactions
			// pour trouver les différentes blockchains
			const blockchainsIds: string[] = []
			for (const portfolioToken of portfolioTokens) {
				for (const tokenTransaction of portfolioToken.TokenTransactions) {
					if (tokenTransaction.blockchain_id && !blockchainsIds.includes(tokenTransaction.blockchain_id)) {
						blockchainsIds.push(tokenTransaction.blockchain_id)
					}
				}
				for (const walletTransaction of portfolioToken.WalletTransactions) {
					if (!blockchainsIds.includes(walletTransaction.blockchain_id)) {
						blockchainsIds.push(walletTransaction.blockchain_id)
					}
				}
			}
			// On va récupérer les datas des blockchains
			for (const blockchainId of blockchainsIds) {
				const blockchainLocalDb = await this.prisma.blockchain.findUnique({
					where: {
						id: blockchainId,
					},
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
				const blockchainApiDb = await dbApiGetBlockchain({ blockchainId: blockchainLocalDb!.api_blockchain_id })
				if (!blockchainApiDb || !blockchainLocalDb) {
					continue
				}
				blockchains.push({
					...blockchainLocalDb,
					_blockchainData: blockchainApiDb,
				})
			}

			/****** EXCHANGES ******/
			// On parcourt les tokens transactions et les exchanges transactions
			// pour trouver les différentes blockchains
			const exchangeIds: string[] = []
			for (const portfolioToken of portfolioTokens) {
				for (const tokenTransaction of portfolioToken.TokenTransactions) {
					if (tokenTransaction.exchange_id && !exchangeIds.includes(tokenTransaction.exchange_id)) {
						exchangeIds.push(tokenTransaction.exchange_id)
					}
				}
				for (const exchangeBalance of portfolioToken.ExchangeBalances) {
					if (!exchangeIds.includes(exchangeBalance.exchange_id)) {
						exchangeIds.push(exchangeBalance.exchange_id)
					}
				}
			}
			// On va récupérer les datas des blockchains
			for (const exchangeId of exchangeIds) {
				const exchangeLocalDb = await this.prisma.exchange.findUnique({
					where: {
						id: exchangeId,
					},
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
				const exchangeApiDb = await dbApiGetExchange({ exchangeId: exchangeLocalDb!.api_exchange_id })
				if (!exchangeApiDb || !exchangeLocalDb) {
					continue
				}
				exchanges.push({
					...exchangeLocalDb,
					_exchangeData: exchangeApiDb,
				})
			}

			// On envoie le message au process > portfolio.ts
			const message: PortfolioStatsMessageUpdate = {
				type: 'portfolio:stats:update',
				data: {
					portfolio: portfolioDb,
					tokens,
					blockchains,
					wallets,
					exchanges,
				},
			}
			this.send(message)
		}
	}

	async actionUpdateWallets(portfolios: PortfolioLocalDB[], userToken: string): Promise<void> {
		this._lockWallet = true

		console.log('----- UPDATE PORTFOLIOS WALLETS', portfolios.length.toString(), userToken, '-----')
		for (const portfolio of portfolios) {
			console.log(JSON.stringify(portfolio))
			console.log('portfolio', portfolio.name, portfolio.id)

			await this.prisma.portfolio.update({
				where: {
					id: portfolio.id,
				},
				data: {
					isUpdating: true,
				},
			})

			const wallets = await this.prisma.portfolioWallet.findMany({
				where: {
					portfolio_id: portfolio.id,
				},
			})
			console.log(wallets.length.toString(), 'wallets dans le portfolio')

			const message: PortfolioWalletsMessageUpdate = {
				type: 'portfolio:wallets:update',
				data: {
					portfolio: portfolio,
					wallets: wallets,
					userToken: userToken,
				},
			}
			this.send(message)
		}
	}

	async actionUpdateExchanges(portfolios: PortfolioLocalDB[], userToken: string): Promise<void> {
		this._lockExchange = true

		console.log('----- UPDATE ALL EXCHANGES', portfolios.length.toString(), userToken, '-----')
		for (const portfolio of portfolios) {
			await this.prisma.portfolio.update({
				where: {
					id: portfolio.id,
				},
				data: {
					isUpdating: true,
				},
			})

			const exchanges = (await this.prisma.portfolioExchange.findMany({
				where: {
					portfolio_id: portfolio.id,
				},
			})) as PortfolioExchangesLocalDB[]
			console.log(exchanges.length.toString(), 'exchanges dans le portfolio')

			for (let i = 0; i < exchanges.length; i++) {
				const exchangeLocalDb = await this.prisma.exchange.findUnique({
					where: {
						id: exchanges[i].exchange_id,
					},
				})
				if (!exchangeLocalDb) continue
				const exchangeApiDb = await dbApiGetExchange({ exchangeId: exchangeLocalDb.api_exchange_id })
				if (!exchangeApiDb) {
					continue
				}

				exchanges[i]._exchangeData = exchangeApiDb
			}

			const message: PortfolioExchangesMessageUpdate = {
				type: 'portfolio:exchanges:update',
				data: {
					portfolio: portfolio,
					exchanges: exchanges,
					userToken: userToken,
				},
			}
			this.send(message)
		}
	}

	async actionUpdateAll(portfolios: PortfolioLocalDB[], userToken: string): Promise<void> {
		await this.actionUpdateWallets(portfolios, userToken)
		while (this._lockWallet) {
			// On attend 1 seconde
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
		await this.actionUpdateExchanges(portfolios, userToken)
		while (this._lockExchange) {
			// On attend 1 seconde
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
		await this.actionUpdateTokens(portfolios)
	}

	async actionUpdateAllPortfolios(): Promise<void> {
		this.log('----- UPDATE ALL PORTFOLIOS -----')
		this.portfolios = await localApiGetPortfolios({ localPrisma: this.prisma })
		await this.actionUpdateTokens(this.portfolios)
	}
}
