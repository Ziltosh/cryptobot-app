import { watch } from 'blinkdb'
import React from 'react'
import {
	PortfolioExchangeBalancesLocalDB,
	PortfolioExchangesLocalDB,
	PortfolioTokensLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletsLocalDB,
	PortfolioWalletTransactionsLocalDB,
	PortfolioWithStatsLocalDB,
	StatsData,
} from '../../prisma-types/app/portfolio/Portfolio.db.types'
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
} from '../../blink/Portfolio'

/**
 * PORTFOLIOS
 */
interface UsePortfoliosReturn {
	portfolios: PortfolioWithStatsLocalDB[]
	currentPortfolio: PortfolioWithStatsLocalDB | null
}

export const usePortfolios = (): UsePortfoliosReturn => {
	const [portfolios, setPortfolios] = React.useState<PortfolioWithStatsLocalDB[]>([])
	const [currentPortfolio, setCurrentPortfolio] = React.useState<PortfolioWithStatsLocalDB | null>(null)

	React.useEffect(() => {
		let watcherPortfolios: { stop: () => void } | undefined
		let watcherCurrent: { stop: () => void } | undefined

		const fetch = async () => {
			watcherPortfolios = await watch(portfolioTable, (portfolios) => {
				setPortfolios(portfolios)
			})

			watcherCurrent = await watch(portfolioTable, { where: { _isCurrent: true } }, (portfolios) => {
				setCurrentPortfolio(portfolios[0])
			})

			return () => {
				watcherPortfolios?.stop()
				watcherCurrent?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { portfolios, currentPortfolio }
}

/**
 * PORTFOLIO TOKENS
 */
interface UsePortfolioTokensReturn {
	portfolioTokens: PortfolioTokensLocalDB[]
	currentToken: PortfolioTokensLocalDB | null
}

export const usePortfolioTokens = (): UsePortfolioTokensReturn => {
	const [tokens, setTokens] = React.useState<PortfolioTokensLocalDB[]>([])
	const [currentToken, setCurrentToken] = React.useState<PortfolioTokensLocalDB | null>(null)
	const { currentPortfolio } = usePortfolios()

	React.useEffect(() => {
		let watcherTokens: { stop: () => void } | undefined
		let watcherCurrent: { stop: () => void } | undefined

		const fetch = async () => {
			watcherTokens = await watch(
				portfolioTokenTable,
				{
					where: {
						portfolio_id: currentPortfolio?.id,
					},
				},
				(tokens) => {
					setTokens(tokens)
				}
			)
			watcherCurrent = await watch(portfolioTokenTable, { where: { _isCurrent: true } }, (tokens) => {
				console.log('watch change current token', tokens[0]?._tokenApiData.name)
				setCurrentToken(tokens[0])
			})

			return () => {
				watcherTokens?.stop()
				watcherCurrent?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { portfolioTokens: tokens, currentToken: currentToken }
}

/**
 * PORTFOLIO WALLETS
 */

interface UsePortfolioWalletsReturn {
	wallets: PortfolioWalletsLocalDB[]
}

export const usePortfolioWallets = (): UsePortfolioWalletsReturn => {
	const [wallets, setWallets] = React.useState<PortfolioWalletsLocalDB[]>([])
	const { currentPortfolio } = usePortfolios()

	React.useEffect(() => {
		let watcherWallets: { stop: () => void } | undefined

		const fetch = async () => {
			watcherWallets = await watch(
				portfolioWalletTable,
				{ where: { portfolio_id: currentPortfolio?.id } },
				(wallets) => {
					setWallets(wallets)
				}
			)

			return () => {
				watcherWallets?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { wallets: wallets }
}

/**
 * PORTFOLIO WALLET TRANSACTIONS
 */
interface UsePortfolioWalletTransactionsReturn {
	wtransactions: PortfolioWalletTransactionsLocalDB[]
}

export const usePortfolioWalletTransactions = (): UsePortfolioWalletTransactionsReturn => {
	const [wtransactions, setWtransactions] = React.useState<PortfolioWalletTransactionsLocalDB[]>([])

	const { portfolioTokens } = usePortfolioTokens()

	React.useEffect(() => {
		let watcherWtransactions: { stop: () => void } | undefined

		const fetch = async () => {
			watcherWtransactions = await watch(
				portfolioWalletTransactionTable,
				{
					where: {
						portfolio_token_id: {
							in: portfolioTokens.map((t) => t.id),
						},
					},
				},
				(wtransactions) => {
					setWtransactions(wtransactions)
				}
			)

			return () => {
				watcherWtransactions?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [portfolioTokens])

	return { wtransactions: wtransactions }
}

/**
 * PORTFOLIO TOKEN TRANSACTIONS
 */
interface UsePortfolioTokenTransactionsReturn {
	tokenTransactions: PortfolioTokenTransactionsLocalDB[]
	currentTokenTransaction: PortfolioTokenTransactionsLocalDB | null
}

export const usePortfolioTokenTransactions = (): UsePortfolioTokenTransactionsReturn => {
	const [tokenTransactions, setTokenTransactions] = React.useState<PortfolioTokenTransactionsLocalDB[]>([])
	const [currentTokenTransaction, setCurrentTokenTransaction] =
		React.useState<PortfolioTokenTransactionsLocalDB | null>(null)

	const { portfolioTokens } = usePortfolioTokens()

	React.useEffect(() => {
		let watcherTokenTransactions: { stop: () => void } | undefined
		let watcherCurrent: { stop: () => void } | undefined

		const fetch = async () => {
			watcherTokenTransactions = await watch(
				portfolioTokenTransactionTable,
				{
					where: {
						portfolio_token_id: {
							in: portfolioTokens.map((t) => t.id),
						},
					},
				},
				(tokenTransactions) => {
					setTokenTransactions(tokenTransactions)
				}
			)

			watcherCurrent = await watch(
				portfolioTokenTransactionTable,
				{ where: { _isCurrent: true } },
				(transactions) => {
					setCurrentTokenTransaction(transactions[0])
				}
			)

			return () => {
				watcherTokenTransactions?.stop()
				watcherCurrent?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [portfolioTokens])

	return { tokenTransactions: tokenTransactions, currentTokenTransaction: currentTokenTransaction }
}

/**
 * PORTFOLIO EXCHANGES
 */

interface UsePortfolioExchangesReturn {
	exchanges: PortfolioExchangesLocalDB[]
}

export const usePortfolioExchanges = (): UsePortfolioExchangesReturn => {
	const [exchanges, setExchanges] = React.useState<PortfolioExchangesLocalDB[]>([])
	const { currentPortfolio } = usePortfolios()

	React.useEffect(() => {
		let watcherExchanges: { stop: () => void } | undefined

		const fetch = async () => {
			watcherExchanges = await watch(
				portfolioExchangeTable,
				{ where: { portfolio_id: currentPortfolio?.id } },
				(exchanges) => {
					setExchanges(exchanges)
				}
			)

			return () => {
				watcherExchanges?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { exchanges: exchanges }
}

/**
 * PORTFOLIO EXCHANGE TRANSACTIONS
 */
interface UsePortfolioExchangeBalancesReturn {
	etransactions: PortfolioExchangeBalancesLocalDB[]
}

export const usePortfolioExchangeBalances = (): UsePortfolioExchangeBalancesReturn => {
	const [etransactions, setEtransactions] = React.useState<PortfolioExchangeBalancesLocalDB[]>([])

	const { portfolioTokens } = usePortfolioTokens()

	React.useEffect(() => {
		let watcherEtransactions: { stop: () => void } | undefined

		const fetch = async () => {
			watcherEtransactions = await watch(
				portfolioExchangeBalanceTable,
				{
					where: {
						portfolio_token_id: {
							in: portfolioTokens.map((t) => t.id),
						},
					},
				},
				(etransactions) => {
					setEtransactions(etransactions)
				}
			)

			return () => {
				watcherEtransactions?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [portfolioTokens])

	return { etransactions: etransactions }
}

/**
 * PORTFOLIOS STATS
 */
interface UsePortfoliosStatsReturn {
	stats: StatsData
}

export const usePortfoliosStats = (): UsePortfoliosStatsReturn => {
	const [stats, setStats] = React.useState<StatsData>({
		portfolio: {
			id: '',
			nbTransactions: 0,
			valeurActuelle: 0,
			evolutionValeur: 0,
			evolutionPct: 0,
		},
		tokens: [],
		wallets: [],
		blockchains: [],
		exchanges: [],
	})
	const { currentPortfolio } = usePortfolios()

	React.useEffect(() => {
		let watcherStats: { stop: () => void } | undefined

		const fetch = async () => {
			watcherStats = await watch(
				portfolioStatsTable,
				{
					where: {
						portfolio_id: currentPortfolio?.id,
					},
				},
				(stats) => {
					if (stats.length > 0) {
						const data = JSON.parse(stats[0].data) as StatsData
						setStats(data)
					}
				}
			)

			return () => {
				watcherStats?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { stats }
}

/**
 * LOGS
 */
interface UseLogsReturn {
	currentMessage: string | null
}

export const usePortfolioLogs = (): UseLogsReturn => {
	const [currentMessage, setCurrentMessage] = React.useState<string | null>(null)

	React.useEffect(() => {
		let watcherLogs: { stop: () => void } | undefined

		const fetch = async () => {
			watcherLogs = await watch(portfolioLogsTable, {}, (messages) => {
				setCurrentMessage(messages.at(-1)?.message || '')
			})

			return () => {
				watcherLogs?.stop()
			}
		}

		const res = fetch()

		return () => {
			res.then((stop) => {
				stop()
			})
		}
	}, [])

	return { currentMessage }
}
