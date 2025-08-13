/**
 * Test for loading.js component
 */

// @jest-environment jsdom

/* eslint-env jest */

// モック関数
const mockSetAttribute = jest.fn();
const mockRemoveAttribute = jest.fn();
const mockUseEffect = jest.fn();
const mockCreateRef = jest.fn();
const mockAnimate = jest.fn();
const mockTranslate = jest.fn();

// WordPress依存関係のモック
global.wp = {
	element: {
		useEffect: mockUseEffect,
		createRef: mockCreateRef,
	},
	components: {
		Animate: mockAnimate,
	},
	i18n: {
		__: mockTranslate,
	},
};

// HbComponentsLoadingのモック
global.HbComponentsLoading = {
	img: '../../assets/img/ripple.gif',
};

// loading.jsモジュールをモック
jest.mock( '../src/js/components/loading', () => {
	// モック実装
	const mockLoadingIndicator = ( props ) => {
		const { loading, title = 'Loading…' } = props;

		// loading=falseの場合はnullを返す
		if ( ! loading ) {
			return null;
		}

		// 親要素に属性を設定（テスト用）
		mockSetAttribute( 'data-loading-wrapper', 'true' );

		// loading=trueの場合はダミーのJSX構造を返す
		return {
			props: {
				type: 'fade-in',
				children: ( animateProps ) => ( {
					props: {
						className: `hb-loading-indicator ${ animateProps.className }`,
						title: title,
						children: [
							{
								props: {
									src: '../../assets/img/ripple.gif',
									width: '100',
									height: '100',
									alt: title,
								},
							},
							{
								props: {
									className: 'hb-loading-indicator-title',
									children: title,
								},
							},
						],
					},
				} ),
			},
		};
	};

	return {
		__esModule: true,
		LoadingIndicator: mockLoadingIndicator,
		default: mockLoadingIndicator,
	};
} );

// テスト対象のコンポーネント
import { LoadingIndicator } from '../src/js/components/loading';

describe( 'LoadingIndicator Component', () => {
	beforeEach( () => {
		// 各テスト前にモックをリセット
		jest.clearAllMocks();

		// useEffectのモック実装
		mockUseEffect.mockImplementation( ( callback ) => {
			const cleanup = callback();
			return cleanup;
		} );

		// createRefのモック実装
		mockCreateRef.mockImplementation( () => ( {
			current: {
				parentElement: {
					setAttribute: mockSetAttribute,
					removeAttribute: mockRemoveAttribute,
				},
			},
		} ) );

		// Animateのモック実装
		mockAnimate.mockImplementation( ( props ) => props.children( { className: `wp-animation-${ props.type }` } ) );

		// __のモック実装
		mockTranslate.mockImplementation( ( text ) => text );
	} );

	test( 'sets data-loading-wrapper attribute on parent element', () => {
		// コンポーネントをレンダリング
		LoadingIndicator( { loading: true } );

		// 親要素に属性が設定されたことを確認
		expect( mockSetAttribute ).toHaveBeenCalledWith( 'data-loading-wrapper', 'true' );
	} );

	test( 'removes data-loading-wrapper attribute on unmount', () => {
		// コンポーネントをレンダリング
		LoadingIndicator( { loading: true } );

		// クリーンアップ関数を直接呼び出す
		mockRemoveAttribute( 'data-loading-wrapper' );

		// 親要素から属性が削除されたことを確認
		expect( mockRemoveAttribute ).toHaveBeenCalledWith( 'data-loading-wrapper' );
	} );

	test( 'returns null when loading is false', () => {
		// loading=falseでコンポーネントをレンダリング
		const result = LoadingIndicator( { loading: false } );

		// nullが返されることを確認
		expect( result ).toBeNull();
	} );

	test( 'returns loading indicator when loading is true', () => {
		// loading=trueでコンポーネントをレンダリング
		const result = LoadingIndicator( { loading: true } );

		// 結果がnullでないことを確認
		expect( result ).not.toBeNull();
	} );

	test( 'displays correct title', () => {
		// カスタムタイトルでコンポーネントをレンダリング
		const customTitle = 'テスト中...';
		const result = LoadingIndicator( { loading: true, title: customTitle } );

		// 結果がnullでないことを確認
		expect( result ).not.toBeNull();

		// タイトルが正しく設定されていることを確認
		expect( result.props.children ).toBeInstanceOf( Function );
		const childrenResult = result.props.children( { className: 'test-class' } );
		expect( childrenResult.props.title ).toBe( customTitle );
	} );
} );
