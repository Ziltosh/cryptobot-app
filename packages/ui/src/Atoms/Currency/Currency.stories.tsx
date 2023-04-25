import { Currency } from './Currency'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Currency',
	component: Currency,
} as Meta<typeof Currency>

const Template: StoryFn<typeof Currency> = (args) => <Currency {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	value: 100_000,
}

export const PortfolioValue = Template.bind({})
PortfolioValue.args = {
	...Default.args,
	preset: 'portfolio:value',
}
