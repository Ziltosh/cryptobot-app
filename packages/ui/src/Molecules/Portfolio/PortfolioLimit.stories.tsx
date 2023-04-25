import { PortfolioLimit } from './PortfolioLimit'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Portfolio/PortfolioLimit',
	component: PortfolioLimit,
} as Meta<typeof PortfolioLimit>

const Template: StoryFn<typeof PortfolioLimit> = (args) => <PortfolioLimit {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	offerName: 'Gratuit',
	limit: {
		id: '',
		data: {
			portfolios: -1,
			tokens: 2,
			exchanges: 3,
			wallets: 4,
		},
		offerId: '',
		service: 'portfolio',
	},
}

export const Active = Template.bind({})
Active.args = {
	preset: 'active',
	limit: {
		id: '',
		data: {
			portfolios: -1,
			tokens: 2,
			exchanges: 3,
			wallets: 4,
		},
		offerId: '',
		service: 'portfolio',
	},
}
