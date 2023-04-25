import { BlockchainDB, ExchangeDB, TokenDB } from '../../prisma-types/db-api/DB.types'

export interface OptionBase {
	value: string
	label: string
	data?: any
	disabled?: boolean
}

export interface OptionWithImage extends OptionBase {
	image: string
	type: 'blockchain' | 'exchange' | 'token'
	data: BlockchainDB | ExchangeDB | TokenDB
}

export interface GroupOptionWithImage {
	label: string
	options: OptionWithImage[]
	selected?: string
}
