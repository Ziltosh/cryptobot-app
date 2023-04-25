import { PortfolioStat } from './PortfolioStat'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Portfolio/PortfolioStat',
	component: PortfolioStat,
} as Meta<typeof PortfolioStat>

const Template: StoryFn<typeof PortfolioStat> = (args) => <PortfolioStat {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	value: 3,
	text: 'tokens',
}

export const Full = Template.bind({})
Full.args = {
	preset: 'full',
	value: 4,
	text: 'blockchains',
}

export const Currency = Template.bind({})
Currency.args = {
	preset: 'currency',
	value: 100_000,
	text: 'total',
}
