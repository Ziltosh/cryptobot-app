import { PortfolioExchange } from './PortfolioExchange'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Portfolio/PortfolioExchange',
	component: PortfolioExchange,
} as Meta<typeof PortfolioExchange>

const Template: StoryFn<typeof PortfolioExchange> = (args) => <PortfolioExchange {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	name: 'Binance',
}

export const Add = Template.bind({})
Add.args = {
	preset: 'add',
}
