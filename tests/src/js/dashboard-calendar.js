/**
 * Dashboard Calendar Widget Script
 * 
 * Creates a simple calendar widget using Hashboard's date components
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		const $calendarWidget = $('#calendar-widget');
		
		if (!$calendarWidget.length) {
			return;
		}

		// Get current date
		const today = new Date();
		const currentMonth = today.getMonth();
		const currentYear = today.getFullYear();
		const currentDate = today.getDate();

		// Month names
		const monthNames = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];

		// Create calendar HTML
		function createCalendar(month, year) {
			const firstDay = new Date(year, month, 1).getDay();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			const daysInPrevMonth = new Date(year, month, 0).getDate();

			let html = '<div class="calendar-widget">';
			
			// Header with month/year
			html += '<div class="calendar-header d-flex justify-content-between align-items-center mb-2">';
			html += '<button class="btn btn-sm btn-link calendar-prev">&laquo;</button>';
			html += '<h6 class="mb-0">' + monthNames[month] + ' ' + year + '</h6>';
			html += '<button class="btn btn-sm btn-link calendar-next">&raquo;</button>';
			html += '</div>';

			// Days of week
			html += '<table class="table table-sm table-borderless">';
			html += '<thead><tr>';
			const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			dayNames.forEach(function(day) {
				html += '<th class="text-center text-muted small">' + day + '</th>';
			});
			html += '</tr></thead>';

			// Calendar days
			html += '<tbody>';
			
			let date = 1;
			let prevMonthDate = daysInPrevMonth - firstDay + 1;
			let nextMonthDate = 1;

			for (let week = 0; week < 6; week++) {
				html += '<tr>';
				
				for (let day = 0; day < 7; day++) {
					html += '<td class="text-center calendar-day">';
					
					if (week === 0 && day < firstDay) {
						// Previous month dates
						html += '<span class="text-muted small">' + prevMonthDate + '</span>';
						prevMonthDate++;
					} else if (date > daysInMonth) {
						// Next month dates
						html += '<span class="text-muted small">' + nextMonthDate + '</span>';
						nextMonthDate++;
					} else {
						// Current month dates
						const isToday = (year === currentYear && month === currentMonth && date === currentDate);
						const dateClass = isToday ? 'badge bg-primary' : '';
						html += '<span class="' + dateClass + ' calendar-date" data-date="' + year + '-' + (month + 1) + '-' + date + '">' + date + '</span>';
						date++;
					}
					
					html += '</td>';
				}
				
				html += '</tr>';
				
				// Stop if we've displayed all days
				if (date > daysInMonth) {
					break;
				}
			}
			
			html += '</tbody></table>';
			
			// Today button
			html += '<div class="text-center">';
			html += '<button class="btn btn-sm btn-outline-primary calendar-today">Today</button>';
			html += '</div>';
			
			html += '</div>';
			
			return html;
		}

		// Initialize calendar
		let displayMonth = currentMonth;
		let displayYear = currentYear;
		
		function updateCalendar() {
			$calendarWidget.html(createCalendar(displayMonth, displayYear));
		}
		
		updateCalendar();

		// Handle navigation
		$calendarWidget.on('click', '.calendar-prev', function() {
			displayMonth--;
			if (displayMonth < 0) {
				displayMonth = 11;
				displayYear--;
			}
			updateCalendar();
		});

		$calendarWidget.on('click', '.calendar-next', function() {
			displayMonth++;
			if (displayMonth > 11) {
				displayMonth = 0;
				displayYear++;
			}
			updateCalendar();
		});

		$calendarWidget.on('click', '.calendar-today', function() {
			displayMonth = currentMonth;
			displayYear = currentYear;
			updateCalendar();
		});

		// Handle date click
		$calendarWidget.on('click', '.calendar-date', function() {
			const $this = $(this);
			if (!$this.hasClass('text-muted')) {
				// Remove previous selection
				$calendarWidget.find('.calendar-date').removeClass('bg-secondary text-white');
				
				// Add selection to clicked date (unless it's today)
				if (!$this.hasClass('badge')) {
					$this.addClass('bg-secondary text-white');
				}
				
				// Trigger event with selected date
				const selectedDate = $this.data('date');
				$calendarWidget.trigger('dateSelected', [selectedDate]);
				
				console.log('Date selected:', selectedDate);
			}
		});

		// Optional: Integrate with Hashboard's date-range component if available
		if (window.hb && window.hb.components && window.hb.components.dateRange) {
			// Could add a date range selector here
			const $rangeContainer = $('<div class="mt-3"></div>');
			$calendarWidget.after($rangeContainer);
			
			// Initialize date range component
			// This would need React rendering logic similar to the chart example
		}

		// Add some basic styles
		const styles = `
			<style>
				.calendar-widget .calendar-day {
					padding: 2px;
					cursor: pointer;
				}
				.calendar-widget .calendar-date:not(.text-muted):not(.badge):hover {
					background-color: #f0f0f0;
					border-radius: 3px;
				}
				.calendar-widget .badge {
					padding: 4px 8px;
				}
			</style>
		`;
		$('head').append(styles);
	});

})(jQuery);