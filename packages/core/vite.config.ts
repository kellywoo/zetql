import { defineConfig } from 'vite';
import path from 'path';
import dts from 'vite-plugin-dts';

const ext: Record<string, string> = {
	es: 'mjs',
	cjs: 'cjs',
};
export default defineConfig({
	build: {
		lib: {
			entry: {
				'zetql-core': path.resolve(__dirname, 'src/index.ts'),
			},
			formats: ['cjs', 'es'], //  'es' | 'cjs' | 'umd' | 'iife';
			fileName: (format, name) => `${name}.${ext[format] || 'js'}`,
		},
	},
	plugins: [
		dts({
			rollupTypes: true,
			clearPureImport: true,
		}),
	],
});
