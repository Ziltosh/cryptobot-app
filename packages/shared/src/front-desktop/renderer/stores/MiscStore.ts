import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createNavigationSlice, NavigationSlice } from './NavigationSlice'
import { createDiscretModeSlice, DiscretModeSlice } from './DiscretModeSlice'

interface MiscStore {}

export const useMiscStore = create<MiscStore & NavigationSlice & DiscretModeSlice>()(
	persist(
		(...a) => ({
			...createNavigationSlice(...a),
			...createDiscretModeSlice(...a),
		}),
		{
			name: 'misc',
			storage: createJSONStorage(() => localStorage),
		}
	)
)
