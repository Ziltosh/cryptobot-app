import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		build: {
			rollupOptions: {
				input: {
					index: resolve(__dirname, 'src/main/index.ts'),
					portfolio: resolve(__dirname, 'src/main/process/process-files/portfolio.ts'),
				},
				external: ['.prisma/client', 'crypto'],
				output: {
					globals: { crypto: 'crypto' },
				},
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		resolve: {
			alias: {
				'@renderer': resolve('src/renderer'),
			},
		},
		plugins: [react()],
	},
})
