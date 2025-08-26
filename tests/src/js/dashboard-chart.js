/**
 * Dashboard Chart Block Script
 * 
 * Initializes charts using Hashboard's chart components
 */

(function() {
	'use strict';

	// Wait for DOM and components to be ready
	document.addEventListener('DOMContentLoaded', function() {
		const chartContainer = document.getElementById('sales-chart-container');
		
		if (!chartContainer || !window.hb || !window.hb.components) {
			return;
		}

		// Sample data for the chart
		const salesData = {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			datasets: [{
				label: 'Sales',
				data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 38000, 42000, 45000],
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				tension: 0.4
			}, {
				label: 'Target',
				data: [15000, 20000, 20000, 25000, 25000, 30000, 30000, 35000, 35000, 40000, 40000, 50000],
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderDash: [5, 5],
				tension: 0.4
			}]
		};

		// Chart configuration
		const chartConfig = {
			type: 'line',
			data: salesData,
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top',
					},
					title: {
						display: false
					},
					tooltip: {
						mode: 'index',
						intersect: false,
						callbacks: {
							label: function(context) {
								let label = context.dataset.label || '';
								if (label) {
									label += ': ';
								}
								if (context.parsed.y !== null) {
									label += new Intl.NumberFormat('en-US', { 
										style: 'currency', 
										currency: 'USD',
										maximumFractionDigits: 0
									}).format(context.parsed.y);
								}
								return label;
							}
						}
					}
				},
				scales: {
					x: {
						display: true,
						title: {
							display: true,
							text: 'Month'
						}
					},
					y: {
						display: true,
						title: {
							display: true,
							text: 'Revenue ($)'
						},
						ticks: {
							callback: function(value) {
								return '$' + value.toLocaleString();
							}
						}
					}
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false
				}
			}
		};

		// Try to use Hashboard's line chart component if available
		if (window.hb.components.lineChart) {
			// Use Hashboard's React component
			const { createElement } = window.wp.element;
			const { render } = window.wp.element;
			
			const chartElement = createElement(window.hb.components.lineChart, {
				data: salesData,
				options: chartConfig.options
			});
			
			render(chartElement, chartContainer);
		} else if (window.Chart) {
			// Fallback to Chart.js directly if available
			const ctx = document.createElement('canvas');
			chartContainer.appendChild(ctx);
			new Chart(ctx, chartConfig);
		} else {
			// Display message if charts are not available
			chartContainer.innerHTML = '<div class="alert alert-info">Chart component not available. Please ensure chart libraries are loaded.</div>';
		}

		// Optional: Add chart type switcher
		const switcherHtml = `
			<div class="btn-group btn-group-sm mt-2" role="group">
				<button type="button" class="btn btn-outline-secondary active" data-chart-type="line">Line</button>
				<button type="button" class="btn btn-outline-secondary" data-chart-type="bar">Bar</button>
			</div>
		`;
		
		const switcher = document.createElement('div');
		switcher.innerHTML = switcherHtml;
		chartContainer.parentNode.insertBefore(switcher, chartContainer.nextSibling);

		// Handle chart type switching
		switcher.addEventListener('click', function(e) {
			if (e.target.matches('[data-chart-type]')) {
				const buttons = switcher.querySelectorAll('button');
				buttons.forEach(btn => btn.classList.remove('active'));
				e.target.classList.add('active');
				
				const newType = e.target.dataset.chartType;
				// Here you would recreate the chart with the new type
				console.log('Switch to chart type:', newType);
			}
		});
	});

})();