/*!
 * Debug Helper for React + WordPress
 */

// デバッグ用のヘルパー関数
const debugHelper = {
	// WordPress環境チェック
	checkWordPress() {
		console.group('WordPress Environment Check');
		
		const checks = {
			'wp object': typeof wp !== 'undefined',
			'wp.element': typeof wp?.element !== 'undefined',
			'wp.components': typeof wp?.components !== 'undefined',
			'wp.i18n': typeof wp?.i18n !== 'undefined',
			'hb object': typeof hb !== 'undefined',
			'hb.components': typeof hb?.components !== 'undefined',
			'hb.plugins': typeof hb?.plugins !== 'undefined',
		};
		
		Object.entries(checks).forEach(([key, value]) => {
			console.log(`${key}: ${value ? '✅' : '❌'}`);
		});
		
		console.groupEnd();
		return checks;
	},
	
	// コンポーネント存在チェック
	checkComponents() {
		console.group('Components Availability Check');
		
		const requiredComponents = [
			'loading', 'dateRange', 'pagination',
			'barChart', 'lineChart', 'listTable', 'postList'
		];
		
		const componentStatus = {};
		requiredComponents.forEach(comp => {
			const exists = typeof hb?.components?.[comp] === 'function';
			componentStatus[comp] = exists;
			console.log(`${comp}: ${exists ? '✅' : '❌'}`);
		});
		
		console.groupEnd();
		return componentStatus;
	},
	
	// React要素作成テスト
	testReactCreation() {
		console.group('React Element Creation Test');
		
		try {
			const { createElement } = wp.element;
			const testElement = createElement('div', 
				{ className: 'test' }, 
				'Hello React'
			);
			console.log('✅ React createElement working:', testElement);
			return true;
		} catch (error) {
			console.error('❌ React createElement failed:', error);
			return false;
		} finally {
			console.groupEnd();
		}
	},
	
	// DOM要素存在チェック
	checkDOMElements() {
		console.group('DOM Elements Check');
		
		const testIds = [
			'bar-chart-test', 'line-chart-test', 
			'list-table-test', 'post-list-test'
		];
		
		const domStatus = {};
		testIds.forEach(id => {
			const element = document.getElementById(id);
			domStatus[id] = !!element;
			console.log(`#${id}: ${element ? '✅' : '❌'}`);
		});
		
		console.groupEnd();
		return domStatus;
	},
	
	// 総合診断
	diagnose() {
		console.group('🔍 Full System Diagnosis');
		
		const wp = this.checkWordPress();
		const components = this.checkComponents();
		const react = this.testReactCreation();
		const dom = this.checkDOMElements();
		
		const results = { wp, components, react, dom };
		
		// 問題の特定
		const issues = [];
		
		if (!wp['wp object']) issues.push('WordPress scripts not loaded');
		if (!wp['wp.element']) issues.push('wp.element missing - check wp-element dependency');
		if (!wp['hb object']) issues.push('Hashboard scripts not loaded');
		if (!react) issues.push('React creation failing');
		
		const missingComponents = Object.entries(components)
			.filter(([_, exists]) => !exists)
			.map(([name]) => name);
			
		if (missingComponents.length) {
			issues.push(`Missing components: ${missingComponents.join(', ')}`);
		}
		
		if (issues.length) {
			console.group('❌ Issues Found:');
			issues.forEach(issue => console.error(issue));
			console.groupEnd();
		} else {
			console.log('✅ All systems operational');
		}
		
		console.groupEnd();
		return { results, issues };
	}
};

// グローバルに登録（デバッグ用）
window.debugHelper = debugHelper;

// 自動診断（開発環境のみ）
if (window.location.hostname === 'localhost' || window.location.hostname.includes('local')) {
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			console.log('🔍 Running automatic diagnosis...');
			debugHelper.diagnose();
		}, 1000);
	});
}

export default debugHelper;