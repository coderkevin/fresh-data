module.exports = {
	presets: [
		'@babel/typescript',
		[
			'@babel/env',
			{
				targets: {
					browsers: ['ie >= 11'],
				},
				exclude: ['transform-async-to-generator', 'transform-regenerator'],
				modules: false,
				loose: true,
			},
		],
	],
	plugins: [
		// dont use 'loose' mode here - need to copy symbols when spreading
		'@babel/proposal-object-rest-spread',
		'@babel/proposal-class-properties',
		process.env.NODE_ENV === 'test' && '@babel/transform-modules-commonjs',
	].filter( Boolean ),
	ignore: [
		process.env.NODE_ENV !== 'test' && '**/__tests__/**',
	].filter( Boolean ),
};
