import { PortfolioItem } from './PortfolioItem'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Portfolio/PortfolioItem',
	component: PortfolioItem,
} as Meta<typeof PortfolioItem>

const Template: StoryFn<typeof PortfolioItem> = (args) => <PortfolioItem {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	name: 'Portfolio #1',
	stats: [
		{
			id: '1',
			evolutionValue: 10_000,
			evolutionPct: 10,
			total: 100_000,
			date: new Date().getTime(),
			portfolio_id: '1',
			data: '{}',
			updatedAt: new Date(),
		},
	],
	type: 'local',
}

export const DefaultNeg = Template.bind({})
DefaultNeg.args = {
	preset: 'default',
	name: 'Portfolio #1',
	type: 'cloud',
	stats: [
		{
			id: '1',
			evolutionValue: -10_000,
			evolutionPct: -10,
			total: 100_000,
			date: new Date().getTime(),
			portfolio_id: '1',
			data: '{}',
			updatedAt: new Date(),
		},
	],
}

export const Add = Template.bind({})
Add.args = {
	preset: 'add',
}
