import { Content } from './Content'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Content',
	component: Content,
} as Meta<typeof Content>

const Template: StoryFn<typeof Content> = (args) => <Content {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	children: 'Bonjour les gens',
}

export const Other = Template.bind({})
Other.args = {
	...Default.args,
	preset: 'default',
}
