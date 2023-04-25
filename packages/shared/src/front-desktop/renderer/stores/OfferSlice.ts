import { StateCreator } from 'zustand'
import produce from 'immer'
import { OfferWithLimitsDB } from '../../../prisma-types/db-api/DB.types'

// type Transaction = PortfolioTransactionLocalDB & { isNew: boolean; dataOrigin: BlockchainDB | ExchangeDB }

export interface OfferSlice {
	offers: OfferWithLimitsDB[]
	setOffers: (offers: OfferWithLimitsDB[]) => void
	addOffer: (portfolio: OfferWithLimitsDB) => void
	deleteOffer: (portfolio: OfferWithLimitsDB) => void
	resetOffers: () => void
}

export const createOfferSlice: StateCreator<OfferSlice, [], [], OfferSlice> = (set) => ({
	offers: [],
	setOffers: (offers: OfferWithLimitsDB[]): void =>
		set(
			produce((state) => {
				state.offers = offers
			})
		),
	addOffer: (portfolio: OfferWithLimitsDB): void =>
		set(
			produce((state) => {
				state.offers.push(portfolio)
			})
		),
	deleteOffer: (portfolio: OfferWithLimitsDB): void =>
		set(
			produce((state) => {
				state.offers = state.offers.filter((p: OfferWithLimitsDB) => p.id !== portfolio.id)
			})
		),
	resetOffers: (): void =>
		set(
			produce((state) => {
				state.offers = []
			})
		),
})
