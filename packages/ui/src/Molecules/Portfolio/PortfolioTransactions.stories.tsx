import { PortfolioTransactions } from "./PortfolioTransactions";
import { Meta, StoryFn } from "@storybook/react";

export default {
	title: 'Molecules/Portfolio/PortfolioTransactions',
	component: PortfolioTransactions,
} as Meta<typeof PortfolioTransactions>

const Template: StoryFn<typeof PortfolioTransactions> = (args) => <PortfolioTransactions {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
}

export const Current = Template.bind({})
Current.args = {
	preset: 'default',
}
