/*
 * @Author: your name
 * @Date: 2020-08-08 08:05:39
 * @LastEditTime: 2020-09-02 09:16:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sd-client\rollup.config.js
 */
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import postcss from 'rollup-plugin-postcss';
import babel from "rollup-plugin-babel";


const production = !process.env.ROLLUP_WATCH;

const pkg = require('./package.json');
const path = require('path');
// const babel = require('rollup-plugin-babel');
const extensions = ['.js', '.ts'];
const outPathBase = 'app/public/';

function serve() {
	let server;
	console.log('31====>', server);
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}
/** ts文件编译 */
const otherPlugins = [
	nodePolyfills(),
	resolve({
		extensions,
		modulesOnly: true,
	}),
	commonjs(),
	babel({
		exclude: 'node_modules/**',
		extensions,
	}),
	production && terser(),

];

export default [
	{
		input: 'src/main.ts',
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: `${outPathBase}build/bundle.js`
		},
		plugins: [
			svelte({
				// enable run-time checks when not in production
				dev: !production,
				// we'll extract any component CSS out into
				// a separate file - better for performance
				// css: css => {
				// 	css.write('public/build/bundle.css');
				// 	// css.write('./src/style/font/font.css');
				// 	// css.write('./src/style/global.scss');
				// },
				preprocess: sveltePreprocess(),
			}),
			postcss({
				extract: true,
				minimize: production,
				extensions: ["css", "scss", "ttf"],
				// 文件scss编译依赖
				process: processSass
			}),
			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration -
			// consult the documentation for details:
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: !production }),
			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `public` directory and refresh the
			// browser on changes when not in production
			!production && livereload(outPathBase),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser(),
			nodePolyfills()
		],
		watch: {
			clearScreen: false
		},
		external: [
			// 告诉 rollup 碰到下面模块时候不要去打包
			'fs',
			'path',
			'http',
			'https',
			'child_process',
			'os',
			'net',
			'electron',
			'serialport',
		],
	}, {
		input: 'src/electron/main.ts',
		output: {
			sourcemap: true,
			format: 'cjs',
			file: path.resolve(__dirname, './', pkg.main),
		},
		plugins: otherPlugins
	}, {
		input: 'src/electron/modbus/index.ts',
		output: {
			sourcemap: true,
			format: 'cjs',
			file: `${outPathBase}electron/modbus/index.js`,
		},
		plugins: otherPlugins,
	}, {
		input: 'src/worker/worker.ts',
		output: {
			sourcemap: true,
			format: 'cjs',
			file: `${outPathBase}worker/worker.js`,
		},
		plugins: otherPlugins
	}

];


function processSass(context, payload) {
	return new Promise((resolve, reject) => {
		sass.render(
			{
				file: context
			},
			function (err, result) {
				if (!err) {
					resolve(result);
				} else {
					reject(err);
				}
			}
		);
	});
}