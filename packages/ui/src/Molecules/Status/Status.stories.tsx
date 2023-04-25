import { Status } from './Status'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Status',
	component: Status,
} as Meta<typeof Status>

const Template: StoryFn<typeof Status> = (args) => <Status {...args} />

export const PortfolioOk = Template.bind({})
PortfolioOk.args = {
	preset: 'portfolio',
	name: 'portfolio',
	isOk: true,
}

export const PortfolioNok = Template.bind({})
PortfolioNok.args = {
	preset: 'api',
	name: 'portfolio',
	isOk: false,
}
