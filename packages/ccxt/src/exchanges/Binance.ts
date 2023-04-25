import { config } from 'dotenv-mono'
import { Exchange, Trade, Transaction } from 'ccxt'
import { CcxtExchange } from './CcxtExchange'

config() // Take environment variables from .env

export class Binance extends CcxtExchange {
	private instance: Exchange

	constructor() {
		super()
		this.instance = CcxtExchange.getInstance('binance')
	}

	protected getSymbol(token: string, currency: string): string {
		if (currency === 'USD') return `${token}/USDT`
		else return `${token}/${currency}`
	}

	protected fetchDeposits = async (credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Transaction[] | null> => {
		if (this.instance.has['fetchDeposits']) {
			this.instance.apiKey = credentials.apiKey
			this.instance.secret = credentials.secret
			this.instance.password = credentials.phrase

			this.instance.checkRequiredCredentials()

			// https://binance-docs.github.io/apidocs/spot/en/#deposit-history-supporting-network-user_data
			// On boucle sur des intervalles de 90 jours
			// jusqu'en 2017, date de création de binance
			// Il faut aussi utiliser l'offset si jamais il y a plus de 1000 transactions sur les 90 jours
			let allDeposits: Transaction[] = []
			const now = new Date()
			while (true) {
				console.log(`demande deposits 90 jours depuis ${now.toISOString()}`)
				const deposits = await this.instance.fetchDeposits(undefined, now.getTime(), undefined, { status: 1 })

				if (deposits.length === 1000) {
					let offset = 1000
					while (true) {
						allDeposits = allDeposits.concat(
							await this.instance.fetchDeposits(undefined, now.getTime(), 1000, {
								status: 1,
								offset: offset,
							})
						)
						if (deposits.length === 1000) {
							offset += 1000
						}
						break
					}
				}

				allDeposits = allDeposits.concat(deposits)

				// Si on n'est pas arrivé en janvier 2017, on enlève 90 jours à la date
				if (now.getFullYear() > 2017 || (now.getFullYear() === 2017 && now.getMonth() > 0)) {
					now.setDate(now.getDate() - 90)
				}
				// Sinon on arrête
				else {
					break
				}
			}

			return allDeposits
		}
		return null
	}

	protected fetchWithdrawals = async (credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Transaction[] | null> => {
		if (this.instance.has['fetchDeposits']) {
			this.instance.apiKey = credentials.apiKey
			this.instance.secret = credentials.secret
			this.instance.password = credentials.phrase

			this.instance.checkRequiredCredentials()

			// https://binance-docs.github.io/apidocs/spot/en/#withdrawal-history-supporting-network-user_data
			// On boucle sur des intervalles de 90 jours
			// jusqu'en 2017, date de création de binance
			// Il faut aussi utiliser l'offset si jamais il y a plus de 1000 transactions sur les 90 jours
			let allDeposits: Transaction[] = []
			const now = new Date()
			while (true) {
				console.log(`demande withdrawals 90 jours depuis ${now.toISOString()}`)
				const deposits = await this.instance.fetchWithdrawals(undefined, now.getTime(), undefined, {
					status: 6,
				})

				if (deposits.length === 1000) {
					let offset = 1000
					while (true) {
						allDeposits = allDeposits.concat(
							await this.instance.fetchWithdrawals(undefined, now.getTime(), 1000, {
								status: 6,
								offset: offset,
							})
						)
						if (deposits.length === 1000) {
							offset += 1000
						}
						break
					}
				}

				allDeposits = allDeposits.concat(deposits)

				// Si on n'est pas arrivé en janvier 2017, on enlève 90 jours à la date
				if (now.getFullYear() > 2017 || (now.getFullYear() === 2017 && now.getMonth() > 0)) {
					now.setDate(now.getDate() - 90)
				}
				// Sinon on arrête
				else {
					break
				}
			}

			return allDeposits
		}
		return null
	}

	protected fetchMyTrades = async (credentials: {
		apiKey: string
		secret: string
		phrase: string
	}): Promise<Trade[] | null> => {
		if (this.instance.has['fetchDeposits']) {
			this.instance.apiKey = credentials.apiKey
			this.instance.secret = credentials.secret
			this.instance.password = credentials.phrase

			this.instance.checkRequiredCredentials()

			// https://docs.com/#/README?id=personal-trades
			// On boucle sur des intervalles de 90 jours
			// jusqu'en 2017, date de création de binance
			// Il faut aussi utiliser l'offset si jamais il y a plus de 1000 transactions sur les 90 jours
			let allTrades: Trade[] = []
			const now = new Date()
			while (true) {
				console.log(`demande trades 1 jour depuis ${now.toISOString()}`)
				const trades = await this.instance.fetchMyTrades('BTC/USDT', now.getTime(), 1000)

				if (trades.length === 1000) {
					while (true) {
						allTrades = allTrades.concat(
							await this.instance.fetchMyTrades('BTC/USDT', now.getTime(), 1000, {
								fromId: trades.at(-1)!.id,
							})
						)
						break
					}
				}

				allTrades = allTrades.concat(trades)

				// Si on n'est pas arrivé en janvier 2017, on enlève 90 jours à la date
				if (now.getFullYear() > 2017 || (now.getFullYear() === 2017 && now.getMonth() > 0)) {
					now.setDate(now.getDate() - 90)
				}
				// Sinon on arrête
				else {
					break
				}
			}

			return allTrades
		}
		return null
	}

	protected getCurrencyOfDeposit = (deposit: Transaction): string => {
		return deposit.info.coin
	}
}
