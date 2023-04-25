import { LogoItem } from './LogoItem'
import { Meta, StoryFn } from '@storybook/react'
import { ExchangeDB } from '@cryptobot/db-api'

export default {
	title: 'Atoms/LogoItem',
	component: LogoItem,
} as Meta<typeof LogoItem>

const Template: StoryFn<typeof LogoItem> = (args) => <LogoItem {...args} />

export const Exchange = Template.bind({})
Exchange.args = {
	preset: 'exchange',
	withText: false,
	name: 'Exchange',
	data: {
		logo_downloaded: false,
		logo: 'https://picsum.photos/200',
		name: 'Exchange',
	} as ExchangeDB,
}

export const ExchangeWithText = Template.bind({})
ExchangeWithText.args = {
	preset: 'exchange',
	withText: true,
	name: 'Exchange',
	data: {
		logo_downloaded: false,
		logo: 'https://picsum.photos/200',
		name: 'Exchange',
	} as ExchangeDB,
}
