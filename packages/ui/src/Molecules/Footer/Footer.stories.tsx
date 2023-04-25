import { Footer } from './Footer'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Molecules/Footer',
	component: Footer,
} as Meta<typeof Footer>

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />

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
