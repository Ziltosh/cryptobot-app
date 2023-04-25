import { themes } from '@storybook/theming'

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	darkMode: {
		// Override the default dark theme
		dark: { ...themes.dark, appBg: '#333' },
		// Override the default light theme
		light: { ...themes.normal, appBg: '#fefefe' },
		current: 'light',
		stylePreview: true,
	},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}
