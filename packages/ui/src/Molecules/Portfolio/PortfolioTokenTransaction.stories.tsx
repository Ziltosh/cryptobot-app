import { PortfolioTokenTransaction } from './PortfolioTokenTransaction'
import { Meta, StoryFn } from '@storybook/react'
import binanceLogo from '../../assets/exchanges/binance-logo.png'

export default {
	title: 'Molecules/Portfolio/PortfolioTransfert',
	component: PortfolioTokenTransaction,
} as Meta<typeof PortfolioTokenTransaction>

const Template: StoryFn<typeof PortfolioTokenTransaction> = (args) => <PortfolioTokenTransaction {...args} />

export const Default = Template.bind({})
Default.args = {
	preset: 'default',
	// @ts-ignore
	transaction: {
		id: '1234',
		blockchain_id: null,
		exchange_id: 'b9010911-2d0f-4c93-8383-4e0b375a4567',
		date: new Date().getTime(),
		prix: Math.random() * 100,
		quantite: Math.random() * 100,
		portfolio_id: '12434',
		type: 'Achat',
		ExchangeOrigine: {
			name: 'Binance',
			id: 'b9010911-2d0f-4c93-8383-4e0b375a4567',
			logo: 'https://picsum.photos/200',
			logo_downloaded: true,
			display_name: 'Binance',
			is_defi: false,
			is_ignored: false,
			name_ccxt: 'binance',
			url: 'https://www.binance.com/',
			coingecko_data: {
				id: 'binance',
				name: 'Binance',
				image: 'https://assets.coingecko.com/markets/images/52/large/binance.jpg?1547034615',
				url: 'https://www.binance.com/',
			},
			custom_data: {
				futures: false,
				dca: false,
				ccxt: false,
				bots: false,
				portfolio: false,
				spot: true,
			},
		},
	},
}

export const Edit = Template.bind({})
Edit.args = {
	preset: 'edit',
	originSelectOptions: [
		{
			label: 'Group',
			options: [
				{
					label: 'Binance',
					value: 'binance',
					image: binanceLogo,
					type: 'exchange',
					data: {
						name: 'Binance',
						is_defi: false,
						id: 'binance',
						url: 'https://www.binance.com/',
						logo: 'https://picsum.photos/200',
						logo_downloaded: true,
						display_name: 'Binance',
						is_ignored: false,
						name_ccxt: 'binance',
						coingecko_data: {
							url: 'https://www.binance.com/',
						} as any,
						custom_data: {},
					},
				},
			],
		},
	],
}
