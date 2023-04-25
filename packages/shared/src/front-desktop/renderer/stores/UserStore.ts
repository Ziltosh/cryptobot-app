import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createUserSlice, UserSlice } from './UserSlice'

interface UserStore {}

export const useUserStore = create<UserStore & UserSlice>()(
	persist(
		(...a) => ({
			...createUserSlice(...a),
		}),
		{
			name: 'user',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
