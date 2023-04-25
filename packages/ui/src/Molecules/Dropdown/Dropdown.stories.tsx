import { Dropdown } from './Dropdown'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Dropdown',
	component: Dropdown,
} as Meta<typeof Dropdown>

const Template: StoryFn<typeof Dropdown> = (args) => <Dropdown {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	items: [
		{
			text: 'Profile',
			url: '#',
		},
		{
			text: 'Settings',
			url: '#',
		},
	],
}
