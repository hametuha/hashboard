#!/usr/bin/env node

const chokidar = require('chokidar');
const { execSync } = require('child_process');
const path = require('path');

// Debounce function to prevent rapid rebuilds
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Build function
function build() {
	console.log('[watch] Building JavaScript...');
	try {
		execSync('npm run --silent build:js', { stdio: 'inherit' });
		console.log('[watch] Build completed successfully');
	} catch (error) {
		console.error('[watch] Build failed:', error.message);
	}
}

// Debounced build function (wait 300ms for multiple changes)
const debouncedBuild = debounce(build, 300);

// Watch for changes in src/js
const watcher = chokidar.watch('src/js/**/*.js', {
	ignored: [
		'**/*.backup',
		'**/.backup*',
		'**/*.LICENSE.txt',
		'.grab-deps-temp/**/*',
		'node_modules/**/*',
		'assets/**/*'
	],
	persistent: true,
	ignoreInitial: true
});

watcher
	.on('change', (filePath) => {
		console.log(`[watch] File changed: ${filePath}`);
		debouncedBuild();
	})
	.on('add', (filePath) => {
		console.log(`[watch] File added: ${filePath}`);
		debouncedBuild();
	})
	.on('unlink', (filePath) => {
		console.log(`[watch] File removed: ${filePath}`);
		debouncedBuild();
	})
	.on('error', (error) => {
		console.error('[watch] Watcher error:', error);
	});

console.log('[watch] Watching src/js/**/*.js for changes...');
console.log('[watch] Press Ctrl+C to stop');

// Graceful shutdown
process.on('SIGINT', () => {
	console.log('\n[watch] Shutting down...');
	watcher.close();
	process.exit(0);
});