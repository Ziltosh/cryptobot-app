import axios, { AxiosError, AxiosInstance } from 'axios'
import {
	ZerionChainsResponse,
	ZerionChartResponse,
	ZerionFilterTransactionTypes,
	ZerionFungiblesResponse,
	ZerionWalletPortfolioResponse,
	ZerionWalletTransactionsResponse,
} from './Zerion.types'

export class ZerionApi {
	private readonly _apiKey?: string
	private readonly url: string
	private readonly maxRequestsPerMinute = 100
	private readonly instance: AxiosInstance

	constructor(url = 'https://api.zerion.io/v1', apiKey?: string) {
		this.url = url
		this._apiKey = apiKey
		console.log('Zerion API key:', this._apiKey)

		if (!this._apiKey) {
			this.instance = axios.create({
				baseURL: this.url,
			})
		} else {
			this.instance = axios.create({
				baseURL: this.url,
				headers: {
					Authorization: `Basic ${Buffer.from(this._apiKey + ':').toString('base64')}`,
				},
			})
		}
	}

	async walletPortfolio(address: string): Promise<ZerionWalletPortfolioResponse> {
		return await this._request('/wallets/:address/portfolio', 'get', { address })
	}

	async chains(): Promise<ZerionChainsResponse> {
		return await this._request('/chains', 'get')
	}

	async chart(fungible_id: string): Promise<ZerionChartResponse> {
		return await this._request(`/fungibles/${fungible_id}/charts/max?currency=usd`, 'get')
	}

	async fungibles(limit = Infinity, from = 0): Promise<ZerionFungiblesResponse> {
		let fungiblesRetour: ZerionFungiblesResponse

		let nb = from
		fungiblesRetour = await this._request<ZerionFungiblesResponse>(
			`/fungibles/?currency=usd&page[size]=100&sort=-market_data.market_cap&page[after]=${nb}`,
			'get'
		)

		while (fungiblesRetour.data.length < limit) {
			nb += 100
			console.log(fungiblesRetour.data.length, "fungiblesRetour.data.length < limit, let's fetch more...")
			const newFungibles = await this._request<ZerionFungiblesResponse>(
				`/fungibles/?currency=usd&page[size]=100&sort=-market_data.market_cap&page[after]=${nb}`,
				'get'
			)
			console.log(newFungibles.data.length, 'newFungibles.data.length')
			fungiblesRetour.data = [...fungiblesRetour.data, ...newFungibles.data]
			if (newFungibles.data.length < 99) {
				// No more fungibles
				break
			}
		}

		if (fungiblesRetour.data.length >= limit) {
			return fungiblesRetour
		}

		return fungiblesRetour
	}

	async walletTransactions(
		address: string,
		transactionTypes: ZerionFilterTransactionTypes = [],
		limit = Infinity
	): Promise<ZerionWalletTransactionsResponse> {
		const transactions = await this._request<ZerionWalletTransactionsResponse>(
			'/wallets/:address/transactions/?currency=usd&page[size]=100&filter[operation_types]=:transactionTypes&after=:after',
			'get',
			{ address, transactionTypes }
		)
		let next = transactions.links.next
		while (next && transactions.data.length >= 100 && transactions.data.length < limit) {
			console.log(transactions.data.length, "transactions.data.length < limit, let's fetch more...")
			const newTransactions = await this._request<ZerionWalletTransactionsResponse>(next, 'get')
			transactions.data = transactions.data.concat(newTransactions.data)
			if (!newTransactions.links.next) {
				// No more transactions
				break
			}
			next = newTransactions.links.next
		}

		return transactions
	}

	async _request<T>(
		url: string,
		method: 'get' | 'post',
		args?: { address?: string; transactionTypes?: ZerionFilterTransactionTypes }
	): Promise<T> {
		url = url.replace(':address', args?.address || '')
		url = url.replace(':transactionTypes', args?.transactionTypes?.join(',') || '')

		console.log(`Zerion API request: ${url}`)
		// throw new Error()

		let tries = 0

		while (tries < 5) {
			try {
				const response = await this.instance[method]<T>(url)
				if (response.status === 202) {
					// Wallet en cours de récupération
					await new Promise((resolve) => setTimeout(resolve, 1000 * 2))
					continue
				}
				// rate limit
				await new Promise((resolve) => setTimeout(resolve, (1000 * 60) / this.maxRequestsPerMinute))

				return response.data
			} catch (error: unknown) {
				tries++

				if (error instanceof AxiosError && error.message == 'Request failed with status code 429') {
					console.error(`Zerion API rate limit exceeded, wait 2s`)
					await new Promise((resolve) => setTimeout(resolve, 1000 * 2))
				} else {
					console.error(`Zerion API returned status ${error}`)
					await new Promise((resolve) => setTimeout(resolve, 10_000))
				}
			}
		}

		throw new Error(`Coingecko API request failed after ${tries} tries`)
	}
}
