import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

const ext: Record<string, string> = {
	es: 'mjs',
	cjs: 'cjs',
};
export default defineConfig({
	resolve: {
		// alias: [
		// 	{
		// 		find: '@zetql/core',
		// 		replacement: path.resolve(__dirname, './../core/src/index.ts'),
		// 	},
		// ],
	},
	build: {
		lib: {
			entry: {
				'zetql-react': path.resolve(__dirname, 'src/index.ts'),
			},
			formats: ['cjs', 'es'], //  'es' | 'cjs' | 'umd' | 'iife';
			fileName: (format, name) => `${name}.${ext[format] || 'js'}`,
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
		},
	},
	plugins: [
		dts({
			rollupTypes: true,
			insertTypesEntry: true,
			clearPureImport: true,
		}),
	],
});
