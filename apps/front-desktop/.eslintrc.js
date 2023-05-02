const base = require('../../_config/.eslintrc.json')
module.exports = {
	...base,
	parserOptions: {
		project: 'tsconfig.node.json',
		tsconfigRootDir: __dirname,
	},
	ignorePatterns: [...base.ignorePatterns, 'functions/**/*.ts'],
}
