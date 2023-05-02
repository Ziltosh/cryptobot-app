const base = require('../../_config/.eslintrc.json')
module.exports = {
	...base,
	parserOptions: {
		project: 'tsconfig.json',
		ecmaFeatures: {
			jsx: true,
		},
		tsconfigRootDir: __dirname,
	},
	ignorePatterns: [...base.ignorePatterns],
}
