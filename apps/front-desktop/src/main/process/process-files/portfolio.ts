import process from 'process'
import {
	PortfolioExchangesMessageResponse,
	PortfolioExchangesMessageUpdate,
	PortfolioMessage,
	PortfolioStatsMessageResponse,
	PortfolioStatsMessageUpdate,
	PortfolioWalletsMessageResponse,
	PortfolioWalletsMessageUpdate,
} from '@cryptobot/shared/src/front-desktop/preload/IpcMessage.types'
import {
	ExchangeBalancesLocalDB,
	PortfolioBlockchainStatsData,
	PortfolioExchangeStatsData,
	PortfolioTokensLocalDB,
	PortfolioTokenStatsData,
	PortfolioWalletStatsData,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'
import {
	dbApiGetCompatibleBlockchains,
	dbApiGetMarketPrice,
	dbApiGetNativeBlockchainToken,
	dbApiGetTokenByExchangeTokenSymbol,
} from '@cryptobot/shared/src/front-desktop/main/process/dbApi.fn'
import { traiterBalanceTokenNatif, traiterEVMTransactionsERC20 } from './portfolioWallets'
import { dateMinusModuloXMin } from '@cryptobot/shared/src/helpers/date.fn'
import {
	getPRUOfToken,
	getQuantiteActuelleOfToken,
	getQuantiteFeesOfToken,
	getQuantiteInOfToken,
	getQuantiteOutOfToken,
	getValeurFeesOfToken,
	getValeurInOfToken,
	getValeurOutOfToken,
} from './portfolioTokens'
import { generateClassName } from '@cryptobot/shared/src/helpers/generateClassName.fn'
import Exchanges from '@cryptobot/ccxt/src/exchanges/_listing'
import { generateId } from '@cryptobot/shared/src/helpers/generateId.fn'
import { CcxtPartialBalances } from '@cryptobot/ccxt/src/ccxt.types'

process.on('message', async (message: PortfolioMessage): Promise<void> => {
	try {
		if (process.send) {
			switch (message.type) {
				case 'log': {
					console.log(`[PORTFOLIO] log: ${message.data}`)
					break
				}

				//-----------------------------------------------------------------
				// TOKENS
				//-----------------------------------------------------------------
				case 'portfolio:stats:update': {
					const { data } = message as PortfolioStatsMessageUpdate
					const { portfolio, wallets, tokens, blockchains, exchanges } = data

					const retour: PortfolioStatsMessageResponse['data'] = {
						tokens: [],
						blockchains: [],
						wallets: [],
						exchanges: [],
						portfolio: {
							id: portfolio.id,
							evolutionPct: 0,
							evolutionValeur: 0,
							valeurActuelle: 0,
							nbTransactions: 0,
						},
					}

					const tokenPrix: { tokenId: string; prix: number }[] = []

					/***** TOKENS *****/
					let indexToken = 1
					for (const token of tokens.filter((t) => t._tokenApiData.coingecko_data.id)) {
						///////
						const log = {
							type: 'portfolio:log',
							data: `Traitement token ${indexToken}/${
								tokens.length
							} | Récupération du prix pour ${token._tokenApiData.symbol.toUpperCase()}...`,
						}
						process.send(log)
						///////

						// Pour chaque token
						// - on check si ce n'est pas un token DEFI (fait dans le filter du for, coingecko n'a pas les tokens DEFI)
						// - on check si ce n'est pas le token natif de la blockchain
						// - on récupère son prix actuel
						// - on parcourt les TokenTransactions et on calcule les valeurs in/out
						// - on parcourt les WalletTransactions et on calcule les valeurs in/out
						// - on parcourt les ExchangeBalances et on calcule les valeurs in/out
						// - on calcule les stats du token

						// if (!token._tokenApiData.coingecko_data.id) {
						// 	indexToken++
						// 	continue
						// }

						const stats: PortfolioTokenStatsData = {
							id: token.id,
							name: token._tokenApiData.name,
							symbol: token._tokenApiData.symbol,
							valeurActuelle: 0,
							prixActuel: 0,
							evolutionPct: 0,
							evolutionValeur: 0,
							pru: 0,
							allocationPct: 0,
							quantiteActuelle: 0,
							quantiteFees: 0,
							quantiteIn: 0,
							quantiteOut: 0,
							valeurFees: 0,
							valeurIn: 0,
							valeurOut: 0,
						}

						// Récupération du prix actuel du token
						// On filtre les tokens sans coingecko_data car ça veut dire que c'est de la DEFI
						// on traitera ça en v5
						if (token._tokenApiData.coingecko_data.id) {
							const currentPrice = await dbApiGetMarketPrice({
								coingeckoOrZerionId: token._tokenApiData.coingecko_data.id,
								currency: 'usd',
								// TODO remettre à 5
								atDate: dateMinusModuloXMin(15),
							})
							stats.prixActuel = currentPrice.price
							tokenPrix.push({
								tokenId: token.id,
								prix: currentPrice.price,
							})
						} else {
							continue
						}

						// Récupération des stats du token
						const allTransactions = {
							token: token.TokenTransactions,
							wallet: token.WalletTransactions,
							exchange: token.ExchangeBalances,
						}

						stats.quantiteActuelle = Math.max(getQuantiteActuelleOfToken(allTransactions), 0)
						stats.quantiteIn = Math.max(getQuantiteInOfToken(allTransactions), 0)
						stats.quantiteOut = Math.max(getQuantiteOutOfToken(allTransactions), 0)
						stats.pru = Math.max(getPRUOfToken(allTransactions), 0)
						stats.valeurActuelle = stats.quantiteActuelle * stats.prixActuel
						stats.valeurIn = Math.max(getValeurInOfToken(allTransactions), 0)
						stats.valeurOut = getValeurOutOfToken(allTransactions)
						stats.valeurFees = Math.max(getValeurFeesOfToken(allTransactions), 0)
						stats.quantiteFees = Math.max(getQuantiteFeesOfToken(allTransactions), 0)
						stats.evolutionPct = (stats.valeurActuelle + stats.valeurOut) / stats.valeurIn - 1
						stats.evolutionValeur = stats.valeurActuelle + stats.valeurOut - stats.valeurIn

						retour.tokens.push(stats)

						indexToken++
					}

					// Calcul des allocations en %age de chaque token
					const totalValeurActuelle = retour.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
					retour.tokens = retour.tokens.map((t) => {
						return {
							...t,
							allocationPct: t.valeurActuelle / totalValeurActuelle,
						}
					})

					/***** WALLETS *****/
					let indexWallet = 1
					for (const wallet of wallets) {
						///////
						const log = {
							type: 'portfolio:log',
							data: `Traitement wallet ${indexWallet}/${wallets.length} | Analyse des transactions...`,
						}
						process.send(log)
						///////

						const walletStats: PortfolioWalletStatsData = {
							address: wallet.address,
							name: wallet.name,
							evolutionValeur: 0,
							valeurActuelle: 0,
							evolutionPct: 0,
							tokens: [],
							allocationPct: 0,
							nbTransactions: wallet.WalletTransactions.length,
						}

						const tokensInWallet = wallet.WalletTransactions.map((t) => t.PortfolioToken)
						// On déduplique les tokens en fonction de l'id
						const tokensInWalletDedup = tokensInWallet.filter(
							(t, index, self) => index === self.findIndex((t2) => t2?.id === t?.id)
						)

						for (const token of tokensInWalletDedup) {
							if (!token) continue

							const tokenWithData = tokens.find((t) => t.id === token.id)

							// Si c'est un token DEFI, on passe au suivant
							if (!tokenWithData!._tokenApiData.coingecko_data.id) continue

							const stats: PortfolioTokenStatsData = {
								id: token.id,
								name: tokenWithData!._tokenApiData.name,
								symbol: tokenWithData!._tokenApiData.symbol,
								valeurActuelle: 0,
								prixActuel: tokenPrix.find((t) => t.tokenId === token.id)?.prix || 0,
								evolutionPct: 0,
								evolutionValeur: 0,
								pru: 0,
								allocationPct: 0,
								quantiteActuelle: 0,
								quantiteFees: 0,
								quantiteIn: 0,
								quantiteOut: 0,
								valeurFees: 0,
								valeurIn: 0,
								valeurOut: 0,
							}

							// Récupération des stats du token
							const allTransactions = {
								wallet: wallet.WalletTransactions.filter((t) => t.portfolio_token_id === token.id),
							}

							stats.quantiteActuelle = Math.max(getQuantiteActuelleOfToken(allTransactions), 0)
							// Si on n'a plus de quantité actuelle, on passe au token suivant
							if (stats.quantiteActuelle === 0) continue

							stats.quantiteIn = Math.max(getQuantiteInOfToken(allTransactions), 0)
							stats.quantiteOut = Math.max(getQuantiteOutOfToken(allTransactions), 0)
							stats.pru = Math.max(getPRUOfToken(allTransactions), 0)
							stats.valeurActuelle = stats.quantiteActuelle * stats.prixActuel
							stats.valeurIn = Math.max(getValeurInOfToken(allTransactions), 0)
							stats.valeurOut = getValeurOutOfToken(allTransactions)
							stats.valeurFees = Math.max(getValeurFeesOfToken(allTransactions), 0)
							stats.quantiteFees = Math.max(getQuantiteFeesOfToken(allTransactions), 0)
							stats.evolutionPct = (stats.valeurActuelle + stats.valeurOut) / stats.valeurIn - 1
							stats.evolutionValeur = stats.valeurActuelle + stats.valeurOut - stats.valeurIn

							walletStats.tokens.push(stats)
						}

						retour.wallets.push(walletStats)

						indexWallet++
					}

					// Calcul des allocations en %age de chaque token dans chaque wallet
					for (const wallet of retour.wallets) {
						const totalValeurActuelle = wallet.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
						wallet.tokens = wallet.tokens.map((t) => {
							return {
								...t,
								allocationPct: t.valeurActuelle / totalValeurActuelle,
							}
						})
					}
					// Calcul de la valeur actuelle de chaque wallet dans le portfolio
					for (const wallet of retour.wallets) {
						wallet.valeurActuelle = wallet.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
					}

					/***** BLOCKCHAINS *****/
					let indexBlockchain = 1
					for (const blockchain of blockchains) {
						///////
						const log = {
							type: 'portfolio:log',
							data: `Traitement blockchain ${indexBlockchain}/${blockchains.length} | Analyse des transactions...`,
						}
						process.send(log)
						///////

						const blockchainStats: PortfolioBlockchainStatsData = {
							tokens: [],
							evolutionPct: 0,
							valeurActuelle: 0,
							evolutionValeur: 0,
							id: blockchain.id,
							allocationPct: 0,
							name: blockchain._blockchainData!.display_name,
							api_blockchain_id: blockchain.api_blockchain_id,
						}

						const tokensInBlockchain = [
							...blockchain.WalletTransactions.map((t) => t.PortfolioToken),
							...blockchain.TokenTransactions.map((t) => t.PortfolioToken),
						]
						// On déduplique les tokens en fonction de l'id
						const tokensInBlockchainDedup = tokensInBlockchain.filter(
							(t, index, self) => index === self.findIndex((t2) => t2?.id === t?.id)
						)

						for (const token of tokensInBlockchainDedup) {
							if (!token) continue

							const tokenWithData = tokens.find((t) => t.id === token.id)

							if (!tokenWithData || !tokenWithData._tokenApiData) continue

							// Si c'est un token DEFI, on passe au suivant
							if (!tokenWithData._tokenApiData.coingecko_data.id) continue

							const stats: PortfolioTokenStatsData = {
								id: token.id,
								name: tokenWithData!._tokenApiData.name,
								symbol: tokenWithData!._tokenApiData.symbol,
								valeurActuelle: 0,
								prixActuel: tokenPrix.find((t) => t.tokenId === token.id)?.prix || 0,
								evolutionPct: 0,
								evolutionValeur: 0,
								pru: 0,
								allocationPct: 0,
								quantiteActuelle: 0,
								quantiteFees: 0,
								quantiteIn: 0,
								quantiteOut: 0,
								valeurFees: 0,
								valeurIn: 0,
								valeurOut: 0,
							}

							// Récupération des stats du token
							const allTransactions = {
								wallet: blockchain.WalletTransactions.filter((t) => t.portfolio_token_id === token.id),
								token: blockchain.TokenTransactions.filter((t) => t.portfolio_token_id === token.id),
							}

							stats.quantiteActuelle = Math.max(getQuantiteActuelleOfToken(allTransactions), 0)
							// Si on n'a plus de quantité actuelle, on passe au token suivant
							if (stats.quantiteActuelle === 0) continue

							stats.quantiteIn = Math.max(getQuantiteInOfToken(allTransactions), 0)
							stats.quantiteOut = Math.max(getQuantiteOutOfToken(allTransactions), 0)
							stats.pru = Math.max(getPRUOfToken(allTransactions), 0)
							stats.valeurActuelle = stats.quantiteActuelle * stats.prixActuel
							stats.valeurIn = Math.max(getValeurInOfToken(allTransactions), 0)
							stats.valeurOut = getValeurOutOfToken(allTransactions)
							stats.valeurFees = Math.max(getValeurFeesOfToken(allTransactions), 0)
							stats.quantiteFees = Math.max(getQuantiteFeesOfToken(allTransactions), 0)
							stats.evolutionPct = (stats.valeurActuelle + stats.valeurOut) / stats.valeurIn - 1
							stats.evolutionValeur = stats.valeurActuelle + stats.valeurOut - stats.valeurIn

							blockchainStats.tokens.push(stats)
						}

						retour.blockchains.push(blockchainStats)

						indexBlockchain++
					}

					// Calcul des allocations en %age de chaque token dans chaque blockchain
					for (const blockchain of retour.blockchains) {
						const totalValeurActuelle = blockchain.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
						blockchain.tokens = blockchain.tokens.map((t) => {
							return {
								...t,
								allocationPct: t.valeurActuelle / totalValeurActuelle,
							}
						})
					}
					// Calcul de la valeur actuelle de chaque blockchain dans le portfolio
					for (const blockchain of retour.blockchains) {
						blockchain.valeurActuelle = blockchain.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
					}

					/***** EXCHANGES *****/
					let indexExchange = 1
					for (const exchange of exchanges) {
						///////
						const log = {
							type: 'portfolio:log',
							data: `Traitement exchange ${indexExchange}/${exchanges.length} | Analyse des transactions...`,
						}
						process.send(log)
						///////

						const exchangeStats: PortfolioExchangeStatsData = {
							api_exchange_id: exchange.api_exchange_id,
							tokens: [],
							evolutionPct: 0,
							valeurActuelle: 0,
							evolutionValeur: 0,
							id: exchange.id,
							allocationPct: 0,
							name: exchange._exchangeData!.display_name,
						}

						const tokensInExchange = [
							...exchange.TokenTransactions.map((t) => t.PortfolioToken),
							...exchange.ExchangeBalances.map((t) => t.PortfolioToken),
						]
						// On déduplique les tokens en fonction de l'id
						const tokensInExchangeDedup = tokensInExchange.filter(
							(t, index, self) => index === self.findIndex((t2) => t2?.id === t?.id)
						)

						for (const token of tokensInExchangeDedup) {
							if (!token) continue

							const tokenWithData = tokens.find((t) => t.id === token.id)

							// Si c'est un token DEFI, on passe au suivant
							if (!tokenWithData!._tokenApiData.coingecko_data.id) continue

							const stats: PortfolioTokenStatsData = {
								id: token.id,
								name: tokenWithData!._tokenApiData.name,
								symbol: tokenWithData!._tokenApiData.symbol,
								valeurActuelle: 0,
								prixActuel: tokenPrix.find((t) => t.tokenId === token.id)?.prix || 0,
								evolutionPct: 0,
								evolutionValeur: 0,
								pru: 0,
								allocationPct: 0,
								quantiteActuelle: 0,
								quantiteFees: 0,
								quantiteIn: 0,
								quantiteOut: 0,
								valeurFees: 0,
								valeurIn: 0,
								valeurOut: 0,
							}

							// Récupération des stats du token
							const allTransactions = {
								exchange: exchange.ExchangeBalances.filter((t) => t.portfolio_token_id === token.id),
								token: exchange.TokenTransactions.filter((t) => t.portfolio_token_id === token.id),
							}

							stats.quantiteActuelle = Math.max(getQuantiteActuelleOfToken(allTransactions), 0)
							// Si on n'a plus de quantité actuelle, on passe au token suivant
							if (stats.quantiteActuelle === 0) continue

							stats.quantiteIn = Math.max(getQuantiteInOfToken(allTransactions), 0)
							stats.quantiteOut = Math.max(getQuantiteOutOfToken(allTransactions), 0)
							stats.pru = Math.max(getPRUOfToken(allTransactions), 0)
							stats.valeurActuelle = stats.quantiteActuelle * stats.prixActuel
							stats.valeurIn = Math.max(getValeurInOfToken(allTransactions), 0)
							stats.valeurOut = getValeurOutOfToken(allTransactions)
							stats.valeurFees = Math.max(getValeurFeesOfToken(allTransactions), 0)
							stats.quantiteFees = Math.max(getQuantiteFeesOfToken(allTransactions), 0)
							stats.evolutionPct = (stats.valeurActuelle + stats.valeurOut) / stats.valeurIn - 1
							stats.evolutionValeur = stats.valeurActuelle + stats.valeurOut - stats.valeurIn

							exchangeStats.tokens.push(stats)
						}

						retour.exchanges.push(exchangeStats)

						// Calcul des allocations en %age de chaque token dans chaque exchange
						for (const exchange of retour.exchanges) {
							const totalValeurActuelle = exchange.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
							exchange.tokens = exchange.tokens.map((t) => {
								return {
									...t,
									allocationPct: t.valeurActuelle / totalValeurActuelle,
								}
							})
						}
						// Calcul de la valeur actuelle de chaque exchange dans le portfolio
						for (const exchange of retour.exchanges) {
							exchange.valeurActuelle = exchange.tokens.reduce((acc, t) => acc + t.valeurActuelle, 0)
						}

						indexExchange++
					}

					/********** CALCULS FINAUX **********/
					// Calcul des stats pour le portfolio
					retour.portfolio.valeurActuelle = retour.tokens.reduce((acc, b) => acc + b.valeurActuelle, 0)
					retour.portfolio.nbTransactions = tokens.reduce(
						(acc, b) =>
							acc + b.TokenTransactions.length + b.WalletTransactions.length + b.ExchangeBalances.length,
						0
					)
					retour.portfolio.evolutionValeur = retour.tokens.reduce((acc, b) => acc + b.evolutionValeur, 0)
					retour.portfolio.evolutionPct = retour.portfolio.evolutionValeur / retour.portfolio.valeurActuelle

					const reponse: PortfolioStatsMessageResponse = {
						type: 'portfolio:stats:update:response',
						data: retour,
					}
					process.send(reponse)
					break
				}

				//-----------------------------------------------------------------
				// WALLETS
				//-----------------------------------------------------------------
				case 'portfolio:wallets:update': {
					const { data } = message as PortfolioWalletsMessageUpdate
					const { portfolio, wallets, userToken } = data

					const tokensRetour: PortfolioTokensLocalDB[] = []
					const evmNormaltransactionsRetour: PortfolioWalletsMessageResponse['data']['evmNormalTransactions'] =
						[]
					const evmInternaltransactionsRetour: PortfolioWalletsMessageResponse['data']['evmInternalTransactions'] =
						[]
					const evmERC20transactionsRetour: PortfolioWalletsMessageResponse['data']['evmERC20Transactions'] =
						[]
					let evmBalanceRetour: PortfolioWalletsMessageResponse['data']['evmBalanceTransactions'] = []

					let indexWallet = 1
					for (const wallet of wallets) {
						// Récupération des blockchains compatibles
						let blockchains = await dbApiGetCompatibleBlockchains({ type: wallet.address_type })
						// blockchains = [blockchains[0], blockchains[1]]

						for (const blockchain of blockchains) {
							if (wallet.address_type === 'evm') {
								// Récupération du token natif
								const tokenNatif = await dbApiGetNativeBlockchainToken({ blockchain_id: blockchain.id })

								let log: PortfolioMessage

								// Supprimé car impossible de reconstituer le solde du token natif depuis les transactions
								// Eventuellement penser a donner la possibilité de modifier les transactions pour tomber sur le bon solde
								// Voir waltio
								// ///////
								// log = {
								// 	type: 'portfolio:log',
								// 	data: `Traitement wallet ${indexWallet}/${wallets.length} | Récupération des transactions "normales" sur ${blockchain.display_name}...`,
								// }
								// process.send(log)
								// ///////
								//
								// evmNormaltransactionsRetour.push(
								// 	...(await traiterEVMTransactionsNormales({
								// 		process,
								// 		indexWallet,
								// 		wallets,
								// 		userToken,
								// 		tokensRetour,
								// 		blockchain,
								// 		wallet,
								// 		portfolio,
								// 		tokenNatif,
								// 	}))
								// )

								///////
								log = {
									type: 'portfolio:log',
									data: `Traitement wallet ${indexWallet}/${wallets.length} | Récupération de la balance sur ${blockchain.display_name}...`,
								}
								process.send(log)
								///////

								evmBalanceRetour = await traiterBalanceTokenNatif({
									wallet,
									blockchain,
									userToken,
									tokensRetour,
									tokenNatif,
									portfolio,
								})

								// Supprimé car impossible de reconstituer le solde du token natif depuis les transactions
								// Eventuellement penser a donner la possibilité de modifier les transactions pour tomber sur le bon solde
								// Voir waltio

								// ///////
								// log = {
								// 	type: 'portfolio:log',
								// 	data: `Traitement wallet ${indexWallet}/${wallets.length} | Récupération des transactions "internes" sur ${blockchain.display_name}...`,
								// }
								// process.send(log)
								// ///////
								//
								//
								// evmInternaltransactionsRetour.push(
								// 	...(await traiterEVMTransactionsInternal({
								// 		process,
								// 		indexWallet,
								// 		wallets,
								// 		userToken,
								// 		tokensRetour,
								// 		blockchain,
								// 		wallet,
								// 		portfolio,
								// 		tokenNatif,
								// 	}))
								// )

								///////
								log = {
									type: 'portfolio:log',
									data: `Traitement wallet ${indexWallet}/${wallets.length} | Récupération des transactions "ERC20" sur ${blockchain.display_name}...`,
								}
								process.send(log)
								///////

								evmERC20transactionsRetour.push(
									...(await traiterEVMTransactionsERC20({
										process,
										indexWallet,
										wallets,
										userToken,
										tokensRetour,
										blockchain,
										wallet,
										portfolio,
										tokenNatif,
									}))
								)
							}
						}

						indexWallet++
					}

					// console.log('tokensRetour', JSON.stringify(tokensRetour, null, 2))
					// console.log('transactionsRetour', JSON.stringify(transactionsRetour, null, 2))

					const response: PortfolioWalletsMessageResponse = {
						type: 'portfolio:wallets:update:response',
						data: {
							portfolio: portfolio,
							portfolioTokens: tokensRetour,
							evmBalanceTransactions: evmBalanceRetour,
							evmNormalTransactions: evmNormaltransactionsRetour,
							evmInternalTransactions: evmInternaltransactionsRetour,
							evmERC20Transactions: evmERC20transactionsRetour,
						},
					}
					process.send(response)

					break
				}

				//-----------------------------------------------------------------
				// EXCHANGES
				//-----------------------------------------------------------------
				case 'portfolio:exchanges:update': {
					const { data } = message as PortfolioExchangesMessageUpdate

					const { portfolio, exchanges } = data

					const tokensRetour: PortfolioTokensLocalDB[] = []

					const balancesRetour: ExchangeBalancesLocalDB[] = []

					let indexExchange = 1
					for (const exchange of exchanges) {
						const apiData = JSON.parse(exchange.api_data)
						const balancesExchange: ExchangeBalancesLocalDB[] = []

						const className = generateClassName(
							exchange._exchangeData.name_ccxt || exchange._exchangeData.name
						)

						console.log('className', className)

						const exchangeInstance = new Exchanges[className]()

						///////
						let log: { type: string; data: string } | undefined = {
							type: 'portfolio:log',
							data: `Traitement exchange ${indexExchange}/${exchanges.length} | Récupération des balances sur ${exchange._exchangeData.name}...`,
						}
						process.send(log)
						///////

						if (exchangeInstance.fetchBalances) {
							const balances: CcxtPartialBalances = await exchangeInstance.fetchBalances({
								apiKey: apiData.public,
								secret: apiData.private,
								phrase: apiData.password,
							})

							const tokens = balances

							///////
							log = {
								type: 'portfolio:log',
								data: `Traitement des balances de token pour ${exchange._exchangeData.name}...`,
							}
							process.send(log)
							///////

							for (let token in tokens) {
								const balance = tokens[token]
								if (balance > 0) {
									token = token.replace(/^LD([1-9A-Z]+)$/, '$1')
									const tokenApiDb = await dbApiGetTokenByExchangeTokenSymbol({ symbol: token })

									if (!tokenApiDb || !tokenApiDb.coingecko_id) {
										console.error(`Impossible de trouver le token ${token} dans la base de données`)
										continue
									}

									const prix = await dbApiGetMarketPrice({
										coingeckoOrZerionId: tokenApiDb.coingecko_id,
										atDate: dateMinusModuloXMin(15),
										currency: 'usd',
									})

									// On vérifie que le token n'existe pas déjà
									const tokenExiste = tokensRetour.find(
										(token) => token.api_token_id === tokenApiDb.id
									)
									if (!tokenExiste)
										tokensRetour.push({
											id: generateId(10),
											_tokenApiData: tokenApiDb,
											api_token_id: tokenApiDb.id,
											portfolio_id: portfolio.id,
											updatedAt: new Date(),
										})

									const tokenChoix = tokenExiste || tokensRetour.at(-1)!

									// Si on a déjà un token avec le même nom (LDBNB et BNB par exemple)
									// on rajoute la balance au token existant
									const balancesExchangeExisteIndex = balancesExchange.findIndex(
										(balance) => balance.portfolio_token_id === tokenChoix.id
									)

									if (balancesExchangeExisteIndex >= 0) {
										balancesExchange[balancesExchangeExisteIndex].total += balance
										continue
									}

									console.log('ajout de ', token, balance)

									balancesExchange.push({
										id: generateId(10),
										portfolio_exchange_id: exchange.id,
										prix: prix.price,
										type: 'in',
										date: Math.ceil(new Date().getTime() / 1000),
										portfolio_token_id: tokenChoix.id,
										exchange_id: exchange.exchange_id,
										total: balance,
										diff: 0,
										fee_quantite: 0,
										updatedAt: new Date(),
									})
								}
							}

							balancesRetour.push(...balancesExchange)
						}

						indexExchange++
					}

					const response: PortfolioExchangesMessageResponse = {
						type: 'portfolio:exchanges:update:response',
						data: {
							portfolio: portfolio,
							portfolioTokens: tokensRetour,
							balances: balancesRetour,
						},
					}
					process.send(response)

					break
				}

				default:
			}
		}
	} catch (error) {
		console.error(error)
	}
})
