import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

const ext: Record<string, string> = {
	es: 'mjs',
	cjs: 'cjs',
};
export default defineConfig({
	resolve: {},
	build: {
		lib: {
			entry: {
				'zetql-ui': path.resolve(__dirname, 'src/index.ts'),
			},
			formats: ['cjs', 'es'], //  'es' | 'cjs' | 'umd' | 'iife';
			fileName: (format, name) => `${name}.${ext[format] || 'js'}`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'styled-components'],
		},
	},
	plugins: [
		dts({
			clearPureImport: true,
			rollupTypes: true,
			insertTypesEntry: true,
			exclude: ['./vite.config.ts', '**/*/vite-env.d.ts'],
			include: ['../../types'],
		}),
	],
});
