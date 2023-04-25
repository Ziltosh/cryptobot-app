import { Limit } from './Limit'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Limit',
	component: Limit,
} as Meta<typeof Limit>

const Template: StoryFn<typeof Limit> = (args) => <Limit {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	forfait: 'basique',
	current: 1,
	max: '∞',
}
