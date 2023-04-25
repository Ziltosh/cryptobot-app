import { TokenDB } from '../prisma-types/db-api/DB.types'
import { CoingeckoCoin } from '../coingecko/Coingecko.types'
import { ZerionFungible } from '../zerion/Zerion.types'

// export function getNbBlockchainForTransactions(transactions: PortfolioTransactionLocalDB[]): number {
// 	const blockchainIds = transactions.map((transaction) => transaction.blockchain_id)
// 	return new Set(blockchainIds).size
// }

export const cleanTokenApiData = (token: TokenDB): TokenDB => {
	delete (token.coingecko_data as CoingeckoCoin).detail_platforms
	delete (token.coingecko_data as CoingeckoCoin).categories
	delete (token.coingecko_data as CoingeckoCoin).links
	delete (token.coingecko_data as CoingeckoCoin).developer_data
	delete (token.zerion_data as ZerionFungible).relationships
	delete (token.zerion_data as ZerionFungible).attributes?.external_links
	delete (token.zerion_data as ZerionFungible).attributes?.market_data

	return token
}
