import { FormInput } from './FormInput'
import { Meta, StoryFn } from '@storybook/react'
import { Label } from '../../Atoms/Label/Label'
import { Input } from '../../Atoms/Input/Input'

export default {
	title: 'Molecules/FormInput',
	component: FormInput,
} as Meta<typeof FormInput>

const Template: StoryFn<typeof FormInput> = (args) => <FormInput {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	children: (
		<>
			<Label text="Form label" for="input" />
			<Input type={'text'} name={'input'} />
		</>
	),
}

export const Other = Template.bind({})
Other.args = {
	...Default.args,
	preset: 'default',
}
