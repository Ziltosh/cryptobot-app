import { Percent } from './Percent'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Percent',
	component: Percent,
} as Meta<typeof Percent>

const Template: StoryFn<typeof Percent> = (args) => <Percent {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	value: 1,
}

export const Portfolio = Template.bind({})
Portfolio.args = {
	...Default.args,
	preset: 'portfolio:value',
}
