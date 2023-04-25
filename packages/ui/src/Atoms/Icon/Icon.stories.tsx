import { Icon } from './Icon'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Icon',
	component: Icon,
} as Meta<typeof Icon>

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	centered: true,
}

export const WithTextCol = Template.bind({})
WithTextCol.args = {
	...Default.args,
	preset: 'withText',
	text: 'Google',
	flex: 'col',
}

export const WithTextRow = Template.bind({})
WithTextRow.args = {
	...Default.args,
	preset: 'withText',
	text: 'Google',
	flex: 'row',
}
