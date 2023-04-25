import { Button } from './Button'
import { Meta, StoryFn } from '@storybook/react'
import { FaGoogle } from 'react-icons/fa'

export default {
	title: 'Atoms/Button',
	component: Button,
} as Meta<typeof Button>

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	text: 'Bonjour les gens',
}

export const DefaultDisabled = Template.bind({})
DefaultDisabled.args = {
	preset: 'default',
	text: 'Bonjour les gens',
	disabled: true,
}

export const Cancel = Template.bind({})
Cancel.args = {
	...Default.args,
	preset: 'cancel',
}
export const LinkLight = Template.bind({})
LinkLight.args = {
	...Default.args,
	preset: 'link-light',
}

export const LinkDark = Template.bind({})
LinkDark.args = {
	...Default.args,
	preset: 'link-dark',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
	...Default.args,
	preset: 'default',
	icon: <FaGoogle />,
}
