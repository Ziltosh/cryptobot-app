import { ZerionFungible, ZerionFungibleInfo, ZerionTransfer } from '../../../zerion/Zerion.types'
import { BlockchainDB, TokenDB } from '../../../prisma-types/db-api/DB.types'
import {
	dbApiGetBlockchainWithZerionId,
	dbApiGetTokenByAddressAndBlockchain,
	dbApiGetTokenByNameAndSymbol,
	dbApiGetTokenByZerionNameAndSymbol,
} from './dbApi.fn'

export const findTokenApiIdFromTransaction = async (
	transfer: ZerionTransfer,
	blockchain: BlockchainDB
): Promise<TokenDB | undefined> => {
	const implementations = transfer.fungible_info?.implementations || []
	let tokenApiDb: TokenDB | undefined = undefined
	for (const implementation of implementations) {
		tokenApiDb = await dbApiGetTokenByAddressAndBlockchain({
			address: implementation.address,
			blockchain: blockchain.id,
		})
		if (tokenApiDb) break
	}

	if (!tokenApiDb) {
		console.log(`Token ${transfer.fungible_info?.name} not found try with zerion name/symbol`)

		if (transfer.fungible_info?.name && transfer.fungible_info?.symbol) {
			tokenApiDb = await dbApiGetTokenByZerionNameAndSymbol({
				name: transfer.fungible_info?.name,
				symbol: transfer.fungible_info?.symbol,
			})
		} else {
			console.log(`Token ${transfer.fungible_info?.name} not found 2`)
			return
		}

		if (!tokenApiDb) {
			console.log(`Token ${transfer.fungible_info?.name} not found 3`)
			return
		}

		console.log(`Token ${transfer.fungible_info?.name} found with symbol`)
		return tokenApiDb
	} else {
		console.log(`Token ${transfer.fungible_info?.name} found with address`)
		return tokenApiDb
	}
}

export const findTokenApiIdFromFungible = async (
	token: ZerionFungible | ZerionFungibleInfo
): Promise<TokenDB | undefined> => {
	const implementations = ('attributes' in token ? token.attributes.implementations : token.implementations) || []
	const symbol = ('attributes' in token ? token.attributes.symbol : token.symbol) || ''
	const name = ('attributes' in token ? token.attributes.name : token.name) || ''

	let tokenApiDb: TokenDB | undefined = undefined
	for (const implementation of implementations) {
		const blockchain = await findBlockchainApiIdFromImplementation(implementation.chain_id)

		if (blockchain) {
			console.log('\tBlockchain address: ' + implementation.address)
			tokenApiDb = await dbApiGetTokenByAddressAndBlockchain({
				address: implementation.address,
				blockchain: blockchain.id,
			})
		}

		if (tokenApiDb) {
			console.log(
				`\tToken ${symbol} found with address on blockchain ${implementations[0].chain_id} => ${tokenApiDb?.name}`
			)
			break
		} else {
			tokenApiDb = await dbApiGetTokenByNameAndSymbol({
				name: name,
				symbol: symbol,
			})

			if (tokenApiDb) {
				console.log(`\tToken ${symbol} found with name and symbol`)

				break
			}
		}
	}

	return tokenApiDb

	// if (!tokenApiDb) {
	// 	console.log(
	// 		`\tToken ${token.attributes.name} not found try with symbol ${symbol.toLowerCase()}`
	// 	)
	//
	// 	if (!token.attributes.symbol) {
	// 		console.log(`\tToken symbol ${token.attributes.name} not filled`)
	// 		return
	// 	}
	//
	// 	tokenApiDb = await dbApiGetTokenBySymbol({
	// 		symbol: token.attributes.symbol.toLowerCase(),
	// 	})
	//
	// 	// console.log(tokenApiDb)
	//
	// 	if (!tokenApiDb) {
	// 		console.log(`\tToken ${token.attributes.name} not found`)
	// 		return
	// 	}
	//
	// 	console.log(`\tToken ${token.attributes.name} found with symbol`)
	// 	return tokenApiDb
	// } else {
	// 	console.log(`\tToken ${token.attributes.name} found with address`)
	// 	return tokenApiDb
	// }
}

export const findBlockchainApiIdFromImplementation = async (
	zerionBlockchainId: string
): Promise<BlockchainDB | undefined> => {
	const blockchainApiId = dbApiGetBlockchainWithZerionId({ zerionBlockchainId: zerionBlockchainId })

	if (!blockchainApiId) {
		console.log(`\tBlockchain ${zerionBlockchainId} not found`)
		return
	} else {
		console.log(`\tBlockchain ${zerionBlockchainId} found`)
		return blockchainApiId
	}
}
