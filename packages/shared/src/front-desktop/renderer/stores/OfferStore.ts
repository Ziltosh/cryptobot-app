import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createOfferSlice, OfferSlice } from './OfferSlice'

interface OfferStore {
	resetAll: () => void
}

export const useOfferStore = create<OfferStore & OfferSlice>()(
	persist(
		(...a) => ({
			...createOfferSlice(...a),

			resetAll: () => {
				createOfferSlice(...a).resetOffers()
			},
		}),
		{
			name: 'offer',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
