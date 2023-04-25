/// <reference lib="dom" />

import {
	BlockchainDB,
	EVMBalanceTransactionDB,
	EVMERC20TransactionDB,
	EVMInternalTransactionDB,
	EVMNormalTransactionDB,
	ExchangeDB,
	OfferWithLimitsDB,
	PortfolioCloudDB,
	TokenDB,
	UserDB,
} from '../../../prisma-types/db-api/DB.types'

import { config, dotenvLoad } from 'dotenv-mono'
import { EVMERC20Transaction, EVMInternalTransaction, EVMNormalTransaction } from '../../../prisma-types/db-api/client'

const test = dotenvLoad()
config(test)

// console.error('process.env.API_URL', test)

export const dbApiRegister = async ({ login, password }: { login: string; password: string }): Promise<UserDB> => {
	const response = await fetch(`${process.env.API_URL}/user/register`, {
		method: 'POST',
		body: JSON.stringify({ login, password }),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return (await response.json()).data as UserDB
}

export const dbApiLogin = async ({
	login,
	password,
}: {
	login: string
	password: string
}): Promise<{ user: UserDB; token: TokenDB }> => {
	const response = await fetch(`${process.env.API_URL}/user/login`, {
		method: 'POST',
		body: JSON.stringify({ login, password }),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	return (await response.json()).data
}

export const dbApiMe = async ({ token }: { token: string }): Promise<UserDB> => {
	const response = await fetch(`${process.env.API_URL}/user/me`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	return (await response.json()).data
}

export const dbApiGetOffers = async ({ service }: { service: string }): Promise<OfferWithLimitsDB[]> => {
	const response = await fetch(`${process.env.API_URL}/offers?service=${service}`)
	const json = await response.json()
	return json.data as OfferWithLimitsDB[]
}

export const dbApiGetBlockchain = async ({ blockchainId }: { blockchainId: string }): Promise<BlockchainDB> => {
	const response = await fetch(`${process.env.API_URL}/blockchain/${blockchainId}`)
	return (await response.json()).data as BlockchainDB
}

export const dbApiGetBlockchainWithZerionId = async ({
	zerionBlockchainId,
}: {
	zerionBlockchainId: string
}): Promise<BlockchainDB> => {
	const response = await fetch(`${process.env.API_URL}/blockchain/zerion/${zerionBlockchainId}`)
	return (await response.json()).data as BlockchainDB
}

export const dbApiGetExchange = async ({ exchangeId }: { exchangeId: string }): Promise<ExchangeDB> => {
	const response = await fetch(`${process.env.API_URL}/exchange/${exchangeId}`)
	return (await response.json()).data as ExchangeDB
}

export const dbApiGetExchanges = async ({
	service,
	isDefi = 0,
}: {
	service: string
	isDefi: number
}): Promise<ExchangeDB[]> => {
	const response = await fetch(`${process.env.API_URL}/exchanges?service=${service}&is_defi=${isDefi}`)
	return (await response.json()).data as ExchangeDB[]
	// return []
}

export const dbApiGetToken = async ({ tokenId }: { tokenId: string }): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token/${tokenId}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenByAddressAndBlockchain = async ({
	address,
	blockchain,
}: {
	address: string
	blockchain: string
}): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?blockchain=${blockchain}&address=${address}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenByNameAndSymbol = async ({
	name,
	symbol,
}: {
	name: string
	symbol: string
}): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?name=${name}&symbol=${symbol}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenByZerionNameAndSymbol = async ({
	name,
	symbol,
}: {
	name: string
	symbol: string
}): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?zerion_name=${name}&zerion_symbol=${symbol}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenBySymbol = async ({ symbol }: { symbol: string }): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?symbol=${symbol}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenByExchangeTokenSymbol = async ({ symbol }: { symbol: string }): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?exchange_token_symbol=${symbol}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokenByZerionId = async ({ zerionId }: { zerionId: string }): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/token?zerion_id=${zerionId}`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetTokens = async ({ letter }: { letter: string }): Promise<TokenDB[]> => {
	const response = await fetch(`${process.env.API_URL}/tokens?letter=${letter}`)
	return (await response.json()).data as TokenDB[]
}

export const dbApiGetPortfolio = async ({ portfolioId }: { portfolioId: string }): Promise<PortfolioCloudDB> => {
	const response = await fetch(`${process.env.API_URL}/portfolios/${portfolioId}`)
	return (await response.json()).data as PortfolioCloudDB
}

export const dbApiGetPortfolios = async (): Promise<PortfolioCloudDB[]> => {
	const response = await fetch(`${process.env.API_URL}/portfolios`)
	return (await response.json()).data as PortfolioCloudDB[]
}

export const dbApiDeletePortfolio = async ({ portfolioId }: { portfolioId: string }): Promise<void> => {
	await fetch(`${process.env.API_URL}/portfolios/${portfolioId}`, {
		method: 'DELETE',
	})
}

export const dbApiGetTokenBlockchains = async ({ tokenId }: { tokenId: string }): Promise<BlockchainDB[]> => {
	const response = await fetch(`${process.env.API_URL}/token/${tokenId}/blockchains`)
	return (await response.json()).data as BlockchainDB[]
}

export const dbApiGetTokenExchanges = async ({ tokenId }: { tokenId: string }): Promise<ExchangeDB[]> => {
	const response = await fetch(`${process.env.API_URL}/token/${tokenId}/exchanges`)
	return (await response.json()).data as ExchangeDB[]
}

/**
 * Récupère les blockchains compatibles avec le type de wallet (evm, solana, ...)
 * @param type
 */
export const dbApiGetCompatibleBlockchains = async ({ type }: { type: string }): Promise<BlockchainDB[]> => {
	const response = await fetch(`${process.env.API_URL}/wallet/${type}/blockchains`)
	return (await response.json()).data as BlockchainDB[]
}

/**
 * Récupère le token natif d'une blockchain
 * @param blockchain_id
 */
export const dbApiGetNativeBlockchainToken = async ({ blockchain_id }: { blockchain_id: string }): Promise<TokenDB> => {
	const response = await fetch(`${process.env.API_URL}/blockchain/${blockchain_id}/native_token`)
	return (await response.json()).data as TokenDB
}

export const dbApiGetEVMNativeTokenBalance = async ({
	address,
	blockchain_name,
	userToken,
}: {
	address: string
	blockchain_name: string
	userToken: string
}): Promise<{ address: string; result: string }> => {
	const response = await fetch(`${process.env.API_URL}/balance/evm/${blockchain_name}/${address}`, {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	})
	return (await response.json()).data as { address: string; result: string }
}

export const dbApiHandleBalance = async ({
	balance,
	blockchain_name,
	userToken,
}: {
	balance: { address: string; result: string }
	blockchain_name: string
	userToken: string
}): Promise<EVMBalanceTransactionDB[]> => {
	const response = await fetch(`${process.env.API_URL}/transaction/evm/balance/${blockchain_name}/handle`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({
			data_balance: JSON.stringify(balance),
		}),
	})
	return (await response.json()).data as EVMBalanceTransactionDB[]
}

/**
 * Récupère les transactions normales d'un wallet EVM
 * @param address
 * @param blockchain_name
 * @param userToken
 */
export const dbApiGetEVMNormalTransactions = async ({
	address,
	blockchain_name,
	userToken,
}: {
	address: string
	blockchain_name: string
	userToken: string
}): Promise<EVMNormalTransaction[]> => {
	const response = await fetch(`${process.env.API_URL}/transactions/evm/normal/${blockchain_name}/${address}`, {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	})
	return (await response.json()).data as EVMNormalTransaction[]
}

/**
 * Récupère les transactions internes d'un wallet EVM
 * @param address
 * @param blockchain_name
 * @param userToken
 */
export const dbApiGetEVMInternalTransactions = async ({
	address,
	blockchain_name,
	userToken,
}: {
	address: string
	blockchain_name: string
	userToken: string
}): Promise<EVMInternalTransaction[]> => {
	const response = await fetch(`${process.env.API_URL}/transactions/evm/internal/${blockchain_name}/${address}`, {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	})
	return (await response.json()).data as EVMInternalTransaction[]
}

/**
 * Récupère les transactions ERC20 d'un wallet EVM
 * @param address
 * @param blockchain_name
 * @param userToken
 */
export const dbApiGetEVMERC20Transactions = async ({
	address,
	blockchain_name,
	userToken,
}: {
	address: string
	blockchain_name: string
	userToken: string
}): Promise<EVMERC20Transaction[]> => {
	const response = await fetch(`${process.env.API_URL}/transactions/evm/erc20/${blockchain_name}/${address}`, {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	})
	return (await response.json()).data as EVMERC20Transaction[]
}

/**
 * Traite une transaction normale EVM
 * @param transaction
 * @param blockchain_name
 * @param originAddress
 * @param userToken
 */
export const dbApiHandleEVMNormalTransaction = async ({
	transaction,
	blockchain_name,
	originAddress,
	userToken,
}: {
	transaction: EVMNormalTransaction
	blockchain_name: string
	originAddress: string
	userToken: string
}): Promise<EVMNormalTransactionDB> => {
	const response = await fetch(`${process.env.API_URL}/transaction/evm/normal/${blockchain_name}/handle`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({
			data_transaction: JSON.stringify(transaction),
			origin_address: originAddress,
		}),
	})
	return (await response.json()).data as EVMNormalTransactionDB
}

/**
 * Traite une transaction interne EVM
 * @param transaction
 * @param blockchain_name
 * @param originAddress
 * @param userToken
 */
export const dbApiHandleEVMInternalTransaction = async ({
	transaction,
	blockchain_name,
	originAddress,
	userToken,
}: {
	transaction: EVMInternalTransaction
	blockchain_name: string
	originAddress: string
	userToken: string
}): Promise<EVMInternalTransactionDB> => {
	const response = await fetch(`${process.env.API_URL}/transaction/evm/internal/${blockchain_name}/handle`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({
			data_transaction: JSON.stringify(transaction),
			origin_address: originAddress,
		}),
	})
	return (await response.json()).data as EVMInternalTransactionDB
}

/**
 * Traite une transaction ERC20 EVM
 * @param transaction
 * @param blockchain_name
 * @param originAddress
 * @param userToken
 */
export const dbApiHandleEVMERC20Transaction = async ({
	transaction,
	blockchain_name,
	originAddress,
	userToken,
}: {
	transaction: EVMERC20Transaction
	blockchain_name: string
	originAddress: string
	userToken: string
}): Promise<EVMERC20TransactionDB> => {
	const response = await fetch(`${process.env.API_URL}/transaction/evm/erc20/${blockchain_name}/handle`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${userToken}`,
		},
		body: JSON.stringify({
			data_transaction: JSON.stringify(transaction),
			origin_address: originAddress,
		}),
	})
	return (await response.json()).data as EVMERC20TransactionDB
}

/**
 * Récupère le prix d'un token à une date donnée dans une devise donnée
 * @param coingeckoOrZerionId
 * @param currency
 * @param atDate
 */
export const dbApiGetMarketPrice = async ({
	coingeckoOrZerionId,
	currency,
	atDate,
}: {
	coingeckoOrZerionId: string
	currency: string
	atDate: Date
}): Promise<{ coingeckoOrZerionId: string; price: number }> => {
	const response = await fetch(
		`${process.env.API_URL}/market/price?token_id=${coingeckoOrZerionId}&currency=${currency}&at_date=${atDate
			.toISOString()
			.slice(0, -1)}`
	)
	return {
		coingeckoOrZerionId: coingeckoOrZerionId,
		price: (await response.json()).data as number,
	}
}

export const dbApiCreatePortfolio = async ({
	portfolio,
}: {
	portfolio: PortfolioCloudDB
}): Promise<PortfolioCloudDB> => {
	try {
		const response = await fetch(`${process.env.API_URL}/portfolios`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(portfolio),
		})

		return (await response.json()).data as PortfolioCloudDB
	} catch (e: any) {
		console.log('error', e)
		throw new Error('Error creating portfolio' + e.message)
	}
}

export const dbApiPing = async (): Promise<boolean> => {
	try {
		const response = await fetch(`${process.env.API_URL}/ping`)
		const data = await response.json()
		return data.data
	} catch (e) {
		console.log('error', e)
		return false
	}
	return true
}
