import { Sidebar } from "./Sidebar";
import { Meta, StoryFn } from "@storybook/react";
import { Icon } from "../../Atoms/Icon/Icon";
import { FaCalculator, FaRobot, IoMdWallet, MdAutoGraph } from "react-icons/all";

export default {
	title: 'Molecules/Sidebar',
	component: Sidebar,
} as Meta<typeof Sidebar>

const Template: StoryFn<typeof Sidebar> = (args) => <Sidebar {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	children: (
		<>
			<Icon flex={'col'} icon={<FaRobot size={40} className={'mb-2 text-amber-500'} />} />
			<Icon flex={'col'} icon={<MdAutoGraph size={22} />} text={'Stratégies'} />
			<Icon flex={'col'} icon={<FaRobot size={22} />} text={'Bots'} />
			<Icon flex={'col'} icon={<FaCalculator size={22} />} text={'DCA'} />
			<Icon flex={'col'} icon={<IoMdWallet size={22} />} text={'Portfolio'} />
		</>
	),
}
