import babel from '@rollup/plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

const outputFile = '@fresh-data/framework';
const extensions = [ '.ts', '.js' ];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '')

const externalDependencyString = [
	...Object.keys(pkg.dependencies) || {},
	...Object.keys(pkg.peerDependencies) || {},
].join('|');

const isExternalDependency = (key) => {
	const pattern = new RegExp(`^(${externalDependencyString})($|/)`);
	return pattern.test(key);
}

export default [
	// CommonJS
	{
		input: 'src/index.js',
		output: { file: `lib/${outputFile}.js`, format: 'cjs', indent: false },
		external: isExternalDependency,
		plugins: [
			nodeResolve({
				extensions,
			}),
			typescript({ useTsconfigDeclarationDir: true }),
			babel({
				extensions,
				plugins: [
					['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
				],
				babelHelpers: 'runtime',
			}),
		],
	},

	// ES
	{
		input: 'src/index.js',
		output: { file: `es/${outputFile}.js`, format: 'es', indent: false },
		external: isExternalDependency,
		plugins: [
			nodeResolve({
				extensions,
			}),
			typescript({ tsconfigOverride: noDeclarationFiles }),
			babel({
				extensions,
				plugins: [
					[
						'@babel/plugin-transform-runtime',
						{ version: babelRuntimeVersion, useESModules: true },
					],
				],
				babelHelpers: 'runtime',
			}),
		],
	},

	// ES for Browsers
	{
		input: 'src/index.js',
		output: { file: `es/${outputFile}.mjs`, format: 'es', indent: false },
		external: isExternalDependency,
		plugins: [
			nodeResolve({
				extensions,
			}),
			replace({
				'process.env.NODE_ENV': JSON.stringify('production'),
			}),
			typescript({ tsconfigOverride: noDeclarationFiles }),
			babel({
				extensions,
				babelHelpers: 'bundled',
			}),
			terser({
				compress: {
					pure_getters: true, // eslint-disable-line camelcase
					unsafe: true,
					unsafe_comps: true, // eslint-disable-line camelcase
					warnings: false,
				},
			}),
		],
	},

	// UMD Development
	{
		input: 'src/index.js',
		output: {
			file: `dist/${outputFile}.js`,
			format: 'umd',
			name: 'FreshDataFramework',
			indent: false,
			globals: {
				debug: 'Debug',
				lodash: '_',
			},
		},
		external: isExternalDependency,
		plugins: [
			nodeResolve({
				extensions,
			}),
			typescript({ tsconfigOverride: noDeclarationFiles }),
			babel({
				extensions,
				babelHelpers: 'bundled',
			}),
			replace({
				'process.env.NODE_ENV': JSON.stringify('development'),
			}),
		],
	},

	// UMD Production
	{
		input: 'src/index.js',
		output: {
			file: `dist/${outputFile}.min.js`,
			format: 'umd',
			name: 'FreshDataFramework',
			indent: false,
			globals: {
				debug: 'Debug',
				lodash: '_',
			},
		},
		external: isExternalDependency,
		plugins: [
			nodeResolve({
				extensions,
			}),
			typescript({ tsconfigOverride: noDeclarationFiles }),
			babel({
				extensions,
				babelHelpers: 'bundled',
			}),
			replace({
				'process.env.NODE_ENV': JSON.stringify('development'),
			}),
			terser({
				compress: {
					pure_getters: true, // eslint-disable-line camelcase
					unsafe: true,
					unsafe_comps: true, // eslint-disable-line camelcase
					warnings: false,
				},
			}),
		],
	},
]
