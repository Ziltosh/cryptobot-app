import { Input } from './Input'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Input',
	component: Input,
} as Meta<typeof Input>

const Template: StoryFn<typeof Input> = (args) => <Input {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	type: 'text',
	placeholder: 'Placeholder',
}
