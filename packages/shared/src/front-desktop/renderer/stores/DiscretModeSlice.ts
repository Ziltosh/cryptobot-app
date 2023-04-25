import { StateCreator } from 'zustand'
import produce from 'immer'

// type Transaction = PortfolioTransactionLocalDB & { isNew: boolean; dataOrigin: BlockchainDB | ExchangeDB }

export interface DiscretModeSlice {
	discretModeActivated: boolean
	setDiscretModeActivated: (state: boolean) => void
}

export const createDiscretModeSlice: StateCreator<DiscretModeSlice, [], [], DiscretModeSlice> = (set) => ({
	discretModeActivated: false,
	setDiscretModeActivated: (activated: boolean): void => {
		set(
			produce((state: DiscretModeSlice) => {
				state.discretModeActivated = activated
			})
		)
	},
})
