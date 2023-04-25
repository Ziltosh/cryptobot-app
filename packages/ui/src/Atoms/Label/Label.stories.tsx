import { Label } from './Label'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Label',
	component: Label,
} as Meta<typeof Label>

const Template: StoryFn<typeof Label> = (args) => <Label {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	text: 'Form label',
}
