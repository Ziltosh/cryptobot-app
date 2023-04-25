import { PortfolioWallet } from './PortfolioWallet'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Portfolio/PortfolioWallet',
	component: PortfolioWallet,
} as Meta<typeof PortfolioWallet>

const Template: StoryFn<typeof PortfolioWallet> = (args) => <PortfolioWallet {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	name: 'Wallet #1',
	address: '0x1234567890123456789012345678901234567890',
}

export const Add = Template.bind({})
Add.args = {
	preset: 'add',
}
