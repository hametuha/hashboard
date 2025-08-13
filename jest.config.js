module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.(js|jsx|mjs)$': 'babel-jest',
	},
	moduleFileExtensions: [ 'js', 'json', 'jsx', 'mjs' ],
	testMatch: [ '**/tests/**/*.test.{js,jsx,mjs}' ],
	setupFilesAfterEnv: [ './jest.setup.js' ],
	moduleNameMapper: {
		// CSSファイルをモック
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		// WordPressパッケージのマッピング
		'^@wordpress/element$': '<rootDir>/node_modules/@wordpress/element',
		'^@wordpress/i18n$': '<rootDir>/node_modules/@wordpress/i18n',
		'^@wordpress/components$': '<rootDir>/node_modules/@wordpress/components',
	},
};
