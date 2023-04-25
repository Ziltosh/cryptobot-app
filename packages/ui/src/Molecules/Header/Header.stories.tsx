import { Header } from './Header'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Header',
	component: Header,
} as Meta<typeof Header>

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
}
