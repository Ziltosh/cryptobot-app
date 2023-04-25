import {
	PortfolioExchangeBalancesLocalDB,
	PortfolioTokenTransactionsLocalDB,
	PortfolioWalletTransactionsLocalDB,
} from '@cryptobot/shared/src/prisma-types/app/portfolio/Portfolio.db.types'

export function getQuantiteActuelleOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return getQuantiteInOfToken(transactions) - getQuantiteOutOfToken(transactions)
}

export function getQuantiteFeesOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return [...(transactions.token || []), ...(transactions.wallet || []), ...(transactions.exchange || [])]
		.filter((transaction) => transaction.type === 'out')
		.reduce((acc, transaction) => acc + transaction.fee_quantite, 0)
}

export function getValeurFeesOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	// Calculer le nombre de tokens dispo, les achats ajoutent alors que les ventes enlèvent
	let quantity = 0
	for (const transaction of transactions.token || []) {
		if (transaction.type === 'out') {
			quantity += transaction.fee_quantite * transaction.prix
		}
	}

	for (const transaction of transactions.wallet || []) {
		if (transaction.type === 'out') {
			quantity += transaction.fee_quantite * transaction.token_natif_prix
		}
	}

	for (const transaction of transactions.exchange || []) {
		if (transaction.type === 'out') {
			quantity += transaction.fee_quantite * transaction.prix
		}
	}
	return quantity
}

export function getQuantiteInOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return [...(transactions.token || []), ...(transactions.wallet || []), ...(transactions.exchange || [])]
		.filter((transaction) => transaction.type === 'in')
		.reduce((acc, transaction) => {
			if ('total' in transaction) {
				return acc + transaction.diff
			}
			return acc + transaction.quantite
		}, 0)
}

export function getQuantiteOutOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return [...(transactions.token || []), ...(transactions.wallet || []), ...(transactions.exchange || [])]
		.filter((transaction) => transaction.type === 'out')
		.reduce((acc, transaction) => {
			if ('total' in transaction) {
				return acc + transaction.diff
			}
			return acc + transaction.quantite
		}, 0)
}

export function getValeurInOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return [...(transactions.token || []), ...(transactions.wallet || []), ...(transactions.exchange || [])]
		.filter((transaction) => transaction.type === 'in')
		.reduce((acc, transaction) => {
			if ('total' in transaction) {
				return acc + transaction.diff * transaction.prix
			}
			return acc + transaction.quantite * transaction.prix
		}, 0)
}

export function getPRUOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	const sum = [
		...(transactions.token || []),
		...(transactions.wallet || []),
		...(transactions.exchange || []),
	].reduce((acc, transaction) => {
		const value = transaction.type === 'out' ? -1 : 1
		if ('total' in transaction) {
			return acc + transaction.diff * transaction.prix * value
		}
		return acc + transaction.quantite * transaction.prix * value
	}, 0)

	const tokenQuantity = getQuantiteActuelleOfToken(transactions)

	return Math.max(sum / tokenQuantity, 0)
}

// export function getPrixMoyenBuyOfToken(transactions: PortfolioTransactionLocalDB[]): number {
// 	// Calcule le prix moyen des transactions d'achat
// 	return transactions.reduce((acc, transaction) => {
// 		if (transaction.type === 'buy') {
// 			return acc + transaction.quantite * transaction.prix
// 		} else {
// 			return acc
// 		}
// 	}, 0)
// }

export function getValeurOutOfToken(transactions: {
	wallet?: PortfolioWalletTransactionsLocalDB[]
	token?: PortfolioTokenTransactionsLocalDB[]
	exchange?: PortfolioExchangeBalancesLocalDB[]
}): number {
	return [...(transactions.token || []), ...(transactions.wallet || []), ...(transactions.exchange || [])]
		.filter((transaction) => transaction.type === 'out')
		.reduce((acc, transaction) => {
			if ('total' in transaction) {
				return acc + transaction.diff * transaction.prix
			}
			return acc + transaction.quantite * transaction.prix
		}, 0)
}
