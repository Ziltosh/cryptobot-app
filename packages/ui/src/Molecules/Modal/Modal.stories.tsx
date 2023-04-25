import { Modal } from './Modal'
import { Meta, StoryFn } from '@storybook/react'
import { Text } from '../../Atoms/Text/Text'

export default {
	title: 'Molecules/Modal',
	component: Modal,
} as Meta<typeof Modal>

const Template: StoryFn<typeof Modal> = (args) => <Modal {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	title: 'Title',
	children: (
		<Text
			text={
				'Donut cookie cheesecake carrot cake biscuit liquorice **liquorice**. Chocolate bar cake jelly-o tart chupa chups. Fruitcake fruitcake jujubes candy tootsie roll. Tiramisu topping cake pastry toffee. Biscuit shortbread icing cake marzipan. Chocolate carrot cake sweet roll oat cake candy marzipan gummies lemon drops biscuit.'
			}
		/>
	),
}

export const Alert = Template.bind({})
Alert.args = {
	...Default.args,
	preset: 'alert',
}
