import { Select } from './Select'
import { Meta, StoryFn } from '@storybook/react'
import { OptionWithImage } from '@cryptobot/shared/src/ui/select/Option.types'

export default {
	title: 'Atoms/Select',
	component: Select,
} as Meta<typeof Select>

const Template: StoryFn<typeof Select> = (args) => <Select {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	options: [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
	],
	isMulti: false,
	onChange: (option: any) => {
		console.log(option)
	},
}

export const WithImage = Template.bind({})
WithImage.args = {
	preset: 'with-image',
	options: [
		{ value: '1', label: 'Option 1', image: 'https://picsum.photos/200' },
		{ value: '2', label: 'Option 2', image: 'https://picsum.photos/200' },
		{ value: '3', label: 'Option 3', image: 'https://picsum.photos/200' },
	] as OptionWithImage[],
	isMulti: false,
	onChange: (option: any) => {
		console.log(option)
	},
}

export const Multi = Template.bind({})
Multi.args = {
	preset: 'with-image',
	options: [
		{ value: '1', label: 'Option 1', image: 'https://picsum.photos/200' },
		{ value: '2', label: 'Option 2', image: 'https://picsum.photos/200' },
		{ value: '3', label: 'Option 3', image: 'https://picsum.photos/200' },
	] as OptionWithImage[],
	isMulti: true,
	onChange: (option: any) => {
		console.log(option)
	},
}
