import { PortfolioStatsToken } from "./PortfolioStatsToken";
import { Meta, StoryFn } from "@storybook/react";

export default {
	title: 'Molecules/Portfolio/PortfolioStatsToken',
	component: PortfolioStatsToken,
} as Meta<typeof PortfolioStatsToken>

const Template: StoryFn<typeof PortfolioStatsToken> = (args) => <PortfolioStatsToken {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
}
