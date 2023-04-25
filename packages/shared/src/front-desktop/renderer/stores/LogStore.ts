import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import produce from 'immer'

export interface LogStore {
	portfolio: string[]
	addToPortfolio: (log: string) => void
}

export const useLogStore = create<LogStore>()(
	persist(
		(set): LogStore => ({
			portfolio: [],
			addToPortfolio: (log): void => {
				set(
					produce((state) => {
						state.portfolio.push(log)
					})
				)
			},
		}),
		{
			name: 'log-store',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
