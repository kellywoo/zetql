const path = require('path');
module.exports = {
	// plugins: [
	//
	// ],
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
				(plugin) => !(plugin && plugin.constructor && plugin.constructor.name === 'ModuleScopePlugin')
			);
			webpackConfig.resolve.alias = {
				...webpackConfig.resolve.alias,
				'@': path.resolve(__dirname, 'src'),
				'@zetql/react': path.resolve(__dirname, '../../packages/react/src/index.ts'),
				'@ui': path.resolve(__dirname, '../../packages/ui/src'),
			};
			webpackConfig.module.rules[1].oneOf.forEach((rules) => {
				if (rules.test instanceof RegExp && rules.test.test('hello.tsx')) {
					const includes = Array.isArray(rules.include) ? rules.include.slice() : [rules.include];
					includes.push(
						path.resolve(__dirname, '../../packages/react/src'),
						path.resolve(__dirname, '../../packages/core/src'),
						path.resolve(__dirname, '../../packages/ui/src')
					);
					rules.include = includes;
				}
			});
			return webpackConfig;
		},
	},
};
