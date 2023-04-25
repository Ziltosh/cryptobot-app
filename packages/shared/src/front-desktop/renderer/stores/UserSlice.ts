import { StateCreator } from 'zustand'
import { UserDB } from '../../../prisma-types/db-api/DB.types'
import { UserToken } from '../../preload/UserToken.types'

// type Transaction = PortfolioTransactionLocalDB & { isNew: boolean; dataOrigin: BlockchainDB | ExchangeDB }

export interface UserSlice {
	user: UserDB | null
	setUser: (user: UserDB | null) => void

	userToken: UserToken | null
	setUserToken: (userToken: UserToken | null) => void
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
	user: null,
	setUser: (user: UserDB | null): void => set({ user }),

	userToken: null,
	setUserToken: (userToken: UserToken | null): void => set({ userToken }),
})
