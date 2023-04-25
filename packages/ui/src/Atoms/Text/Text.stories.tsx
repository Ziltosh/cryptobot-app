import { Text } from './Text'
import { Meta, StoryFn } from '@storybook/react'

export default {
	title: 'Atoms/Text',
	component: Text,
} as Meta<typeof Text>

const Template: StoryFn<typeof Text> = (args) => <Text {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	text: 'Bonjour les gens',
}

export const H1 = Template.bind({})
H1.args = {
	...Default.args,
	preset: 'h1',
}

export const H2 = Template.bind({})
H2.args = {
	...Default.args,
	preset: 'h2',
}

export const H3 = Template.bind({})
H3.args = {
	...Default.args,
	preset: 'h3',
}

export const Markdown = Template.bind({})
Markdown.args = {
	...Default.args,
	preset: 'default',
	text: 'Texte avec du **gras**',
}
