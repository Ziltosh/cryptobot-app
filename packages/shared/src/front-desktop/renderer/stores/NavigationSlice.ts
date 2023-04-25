import { StateCreator } from 'zustand'
import produce from 'immer'

// type Transaction = PortfolioTransactionLocalDB & { isNew: boolean; dataOrigin: BlockchainDB | ExchangeDB }

export interface NavigationSlice {
	returnToPortfolio: string
	setReturnToPortfolio: (action: 'edit' | 'add') => void
}

export const createNavigationSlice: StateCreator<NavigationSlice, [], [], NavigationSlice> = (set) => ({
	returnToPortfolio: '/portfolio/create',
	setReturnToPortfolio: (action): void => {
		set(
			produce((state) => {
				state.returnToPortfolio = action === 'edit' ? '/portfolio/edit' : '/portfolio/create'
			})
		)
	},
})
