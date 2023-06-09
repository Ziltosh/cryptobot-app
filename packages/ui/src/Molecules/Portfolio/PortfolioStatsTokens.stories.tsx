import { PortfolioStatsTokens } from "./PortfolioStatsTokens";
import { Meta, StoryFn } from "@storybook/react";

export default {
	title: 'Molecules/Portfolio/PortfolioStatsTokens',
	component: PortfolioStatsTokens,
} as Meta<typeof PortfolioStatsTokens>

const Template: StoryFn<typeof PortfolioStatsTokens> = (args) => <PortfolioStatsTokens {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
}
