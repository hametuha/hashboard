/**
 * Dashboard Activity Block Script
 * 
 * Handles dynamic updates for the recent activity block
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		const $activityBlock = $('#recent-activity');
		
		if (!$activityBlock.length) {
			return;
		}

		// Auto-refresh activity every 60 seconds
		let refreshInterval;
		
		function startAutoRefresh() {
			refreshInterval = setInterval(function() {
				refreshActivity();
			}, 60000); // 60 seconds
		}

		function stopAutoRefresh() {
			if (refreshInterval) {
				clearInterval(refreshInterval);
			}
		}

		function refreshActivity() {
			const $list = $activityBlock.find('.list-group');
			
			// Add loading state
			$list.css('opacity', '0.5');
			
			// In real implementation, this would be an AJAX call
			// For demo, we'll just simulate a refresh
			setTimeout(function() {
				$list.css('opacity', '1');
				
				// Add a subtle highlight effect
				$list.find('.list-group-item').first().addClass('bg-light');
				setTimeout(function() {
					$list.find('.list-group-item').first().removeClass('bg-light');
				}, 1000);
			}, 500);
		}

		// Handle manual refresh if action button exists
		$activityBlock.on('click', '.refresh-activity', function(e) {
			e.preventDefault();
			refreshActivity();
		});

		// Initialize auto-refresh
		startAutoRefresh();

		// Stop refresh when page is hidden
		document.addEventListener('visibilitychange', function() {
			if (document.hidden) {
				stopAutoRefresh();
			} else {
				startAutoRefresh();
			}
		});

		// Add hover effect for list items
		$activityBlock.on('mouseenter', '.list-group-item', function() {
			$(this).addClass('shadow-sm');
		}).on('mouseleave', '.list-group-item', function() {
			$(this).removeClass('shadow-sm');
		});

		// Optional: Add click handler for list items
		$activityBlock.on('click', '.list-group-item', function(e) {
			if (!$(e.target).is('a')) {
				const postId = $(this).data('post-id');
				if (postId) {
					// Could open in modal or navigate to post
					console.log('Post clicked:', postId);
				}
			}
		});
	});

})(jQuery);