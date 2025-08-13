// グローバルオブジェクトのモック
global.window = global.window || {};
global.hb = global.hb || { plugins: {}, components: {}, filters: {} };

// React グローバルオブジェクト
global.React = require('react');

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// WordPress グローバルオブジェクトのモック
global.wp = global.wp || {
	element: require('@wordpress/element'),
	i18n: require('@wordpress/i18n'),
	components: require('@wordpress/components'),
	apiFetch: jest.fn(),
};

// window.wp も設定（コンパイルされたコードはwindow.wpを参照）
global.window.wp = global.wp;
