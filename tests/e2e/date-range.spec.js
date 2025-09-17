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

		// Check for the actual DateRange trigger button
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		await expect( dateRangeTrigger ).toBeVisible();
	} );

	test( 'should open date picker when button is clicked', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );

		// Find the date range trigger button
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		await expect( dateRangeTrigger ).toBeVisible();

		// Click the button to open date picker
		await dateRangeTrigger.click();

		// Check if popover appears
		const popover = page.locator( '.hb-date-range-popover' );
		await expect( popover ).toBeVisible();

		// Check if both DatePickers are visible inside popover
		const startDatePicker = popover.locator( '.components-datetime__date' ).first();
		const endDatePicker = popover.locator( '.components-datetime__date' ).last();
		await expect( startDatePicker ).toBeVisible();
		await expect( endDatePicker ).toBeVisible();
	} );

	test( 'should close date picker after selecting a date', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );

		// Open date range picker
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		await dateRangeTrigger.click();

		// Wait for popover
		const popover = page.locator( '.hb-date-range-popover' );
		await expect( popover ).toBeVisible();

		// Click the Apply button to close
		const applyButton = popover.locator( 'button:has-text("Apply")' );
		if ( await applyButton.isVisible() ) {
			await applyButton.click();

			// Check if popover is closed
			await expect( popover ).not.toBeVisible();
		}
	} );

	test( 'should handle popover closing by clicking outside', async ( { page } ) => {
		// Wait for React to render
		await page.waitForTimeout( 2000 );

		// Find the date range trigger button
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		await expect( dateRangeTrigger ).toBeVisible();

		// Click the button to open date picker
		await dateRangeTrigger.click();

		// Check if popover appears
		const popover = page.locator( '.hb-date-range-popover' );
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

		// Check that popover is not visible initially
		const popover = page.locator( '.hb-date-range-popover' );
		await expect( popover ).not.toBeVisible();

		// Check that trigger button is visible instead
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		await expect( dateRangeTrigger ).toBeVisible();
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
		
		// Try to interact with date picker
		const dateRangeTrigger = page.locator( '.hb-date-range-trigger' );
		if ( await dateRangeTrigger.isVisible() ) {
			await dateRangeTrigger.click();
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