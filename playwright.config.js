const { defineConfig, devices } = require( '@playwright/test' );

module.exports = defineConfig( {
	// Timeout per test
	timeout: 30 * 1000,
	
	// Test directory
	testDir: './tests/e2e',
	
	// Use wp-env for testing
	use: {
		baseURL: 'http://localhost:8888',
		// Trace on first retry
		trace: 'on-first-retry',
		// Video on retain on failure
		video: 'retain-on-failure',
	},
	
	// Configure projects for different browsers
	projects: [
		{
			name: 'chromium',
			use: { 
				...devices[ 'Desktop Chrome' ],
			},
		},
	],
	
	// Run wp-env before tests
	webServer: {
		command: 'npm start',
		port: 8888,
		reuseExistingServer: true,
	},
	
	// Reporter configuration
	reporter: [
		[ 'html', { open: 'never' } ],
		[ 'list' ],
	],
} );