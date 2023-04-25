import { PortfolioToken } from './PortfolioToken'
import { Meta, StoryFn } from '@storybook/react'
import ethereumLogo from '../../assets/tokens/ethereum-logo.png'

export default {
	title: 'Molecules/Portfolio/PortfolioToken',
	component: PortfolioToken,
} as Meta<typeof PortfolioToken>

const Template: StoryFn<typeof PortfolioToken> = (args) => <PortfolioToken {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	name: 'Ethereum',
	logo: ethereumLogo,
}

export const Add = Template.bind({})
Add.args = {
	preset: 'add',
}
