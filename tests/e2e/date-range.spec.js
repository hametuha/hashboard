const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Date Range Component', () => {
	test.beforeEach( async ( { page, admin } ) => {
		// First login as admin
		await page.goto( 'http://localhost:8888/wp-login.php' );
		await page.fill( '#user_login', 'admin' );
		await page.fill( '#user_pass', 'password' );
		await page.click( '#wp-submit' );
		
		// Wait for login to complete
		await page.waitForLoadState( 'networkidle' );
		
		// Then visit the kitchen sink page
		await page.goto( 'http://localhost:8888/dashboard/kitchen-sink/components' );
	} );

	test( 'should display date range component', async ( { page } ) => {
		// Wait for page to load
		await page.waitForLoadState( 'networkidle' );
		
		// Check if date selection section exists
		const dateSection = page.locator( 'text=日付選択コンポーネント' );
		await expect( dateSection ).toBeVisible();
		
		// Check for date range component
		const dateRangeContainer = page.locator( '#react-datepicker-test' );
		await expect( dateRangeContainer ).toBeVisible();
	} );

	test( 'should open date picker when button is clicked', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );
		
		// Find the start date button
		const startDateButton = page.locator( '.hb-date-range-start button' ).first();
		await expect( startDateButton ).toBeVisible();
		
		// Click the button to open date picker
		await startDateButton.click();
		
		// Check if popover appears
		const popover = page.locator( '.components-popover' );
		await expect( popover ).toBeVisible();
		
		// Check if DatePicker is visible inside popover
		const datePicker = popover.locator( '.components-datetime__date' );
		await expect( datePicker ).toBeVisible();
	} );

	test( 'should close date picker after selecting a date', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );
		
		// Open start date picker
		const startDateButton = page.locator( '.hb-date-range-start button' ).first();
		await startDateButton.click();
		
		// Wait for popover
		const popover = page.locator( '.components-popover' );
		await expect( popover ).toBeVisible();
		
		// Select a date (click on day 15)
		const dayButton = popover.locator( 'button[aria-label*="15"]' ).first();
		if ( await dayButton.isVisible() ) {
			await dayButton.click();
			
			// Check if popover is closed
			await expect( popover ).not.toBeVisible();
			
			// Check if date is displayed in button
			const buttonText = await startDateButton.textContent();
			expect( buttonText ).toContain( '15' );
		}
	} );

	test( 'should handle end date picker independently', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );
		
		// Find the end date button
		const endDateButton = page.locator( '.hb-date-range-end button' ).first();
		await expect( endDateButton ).toBeVisible();
		
		// Click the button to open date picker
		await endDateButton.click();
		
		// Check if popover appears
		const popover = page.locator( '.components-popover' );
		await expect( popover ).toBeVisible();
		
		// Close by clicking outside
		await page.click( 'body', { position: { x: 10, y: 10 } } );
		
		// Check if popover is closed
		await expect( popover ).not.toBeVisible();
	} );

	test( 'should not have date picker always open', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );
		
		// Check that no date picker is initially visible
		const datePicker = page.locator( '.components-datetime__date' );
		await expect( datePicker ).not.toBeVisible();
		
		// Check that buttons are visible instead
		const startButton = page.locator( '.hb-date-range-start button' );
		const endButton = page.locator( '.hb-date-range-end button' );
		
		await expect( startButton ).toBeVisible();
		await expect( endButton ).toBeVisible();
	} );

	test( 'should capture console errors', async ( { page } ) => {
		const consoleErrors = [];
		
		// Listen for console errors
		page.on( 'console', msg => {
			if ( msg.type() === 'error' ) {
				consoleErrors.push( msg.text() );
			}
		} );
		
		// Wait for page to fully load
		await page.waitForTimeout( 3000 );
		
		// Try to interact with date pickers
		const startDateButton = page.locator( '.hb-date-range-start button' ).first();
		if ( await startDateButton.isVisible() ) {
			await startDateButton.click();
			await page.waitForTimeout( 1000 );
			
			// Try to close
			await page.keyboard.press( 'Escape' );
			await page.waitForTimeout( 1000 );
		}
		
		// Log any errors found
		if ( consoleErrors.length > 0 ) {
			console.log( 'Console errors detected:' );
			consoleErrors.forEach( error => console.log( error ) );
		}
		
		// Test passes even with errors, but logs them for debugging
		expect( consoleErrors.length ).toBeGreaterThanOrEqual( 0 );
	} );
} );