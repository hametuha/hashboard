<?php

namespace Hametuha\Hashboard\Tests;


use Hametuha\SingletonPattern\Singleton;

/**
 * Custom dashboard for local development.
 */
class CustomDashboard extends Singleton {

	protected function init() {
		add_filter( 'hashboard_dashboard_blocks', [ $this, 'dashboard_blocks' ], 10, 1 );
		add_action( 'init', [ $this, 'register_assets' ] );
	}

	/**
	 * Register custom blocks.
	 *
	 * @param array $blocks Existing blocks.
	 *
	 * @return array Modified blocks.
	 */
	public function dashboard_blocks( $blocks ) {
		// 1. Statistics Block (1 column)
		$blocks[] = [
			'id'           => 'user-stats',
			'title'        => __( 'User Statistics', 'hashboard' ),
			'size'         => 1,
			'html'         => $this->render_stats_block(),
			'action'       => admin_url( 'users.php' ),
			'action_label' => __( 'View All', 'hashboard' ),
			'styles'       => [ 'hb-test-stats' ],
			'card_class'   => 'shadow',
		];

		// 2. Recent Activity Block (2 columns)
		$blocks[] = [
			'id'           => 'recent-activity',
			'title'        => __( 'Recent Activity', 'hashboard' ),
			'size'         => 2,
			'html'         => $this->render_activity_block(),
			'action'       => admin_url( 'edit.php' ),
			'action_label' => __( 'View All Posts', 'hashboard' ),
			'scripts'      => [ 'hb-test-activity' ],
			'card_class'   => 'shadow text-bg-primary',
		];

		// 3. Chart Block (2 columns)
		$blocks[] = [
			'id'           => 'sales-chart',
			'title'        => __( 'Monthly Sales', 'hashboard' ),
			'size'         => 2,
			'html'         => '<div id="sales-chart-container" style="height: 300px;"></div>',
			'scripts'      => [ 'hb-test-chart-init' ],
		];

		// 4. Quick Links Block (1 column)
		$blocks[] = [
			'id'    => 'quick-links',
			'title' => __( 'Quick Links', 'hashboard' ),
			'size'  => 1,
			'html'  => $this->render_quick_links(),
		];

		// 5. Notifications Block (3 columns - full width)
		$blocks[] = [
			'id'           => 'notifications',
			'title'        => __( 'System Notifications', 'hashboard' ),
			'size'         => 3,
			'html'         => $this->render_notifications(),
			'action'       => admin_url( 'index.php' ),
			'action_label' => __( 'Dashboard', 'hashboard' ),
			'styles'       => [ 'hb-test-notifications' ],
		];

		// 6. Calendar Widget (1 column)
		$blocks[] = [
			'id'      => 'calendar-widget',
			'title'   => __( 'Calendar', 'hashboard' ),
			'size'    => 1,
			'html'    => '<div id="calendar-widget"></div>',
			'scripts' => [ 'hb-test-calendar' ],
		];

		return $blocks;
	}

	/**
	 * Render statistics block.
	 *
	 * @return string
	 */
	private function render_stats_block() {
		$user_count    = count_users();
		$post_count    = wp_count_posts();
		$comment_count = wp_count_comments();

		return sprintf(
			'<div class="row text-center">
				<div class="col-4">
					<h3>%d</h3>
					<small class="text-muted">%s</small>
				</div>
				<div class="col-4">
					<h3>%d</h3>
					<small class="text-muted">%s</small>
				</div>
				<div class="col-4">
					<h3>%d</h3>
					<small class="text-muted">%s</small>
				</div>
			</div>',
			$user_count['total_users'],
			__( 'Users', 'hashboard' ),
			$post_count->publish,
			__( 'Posts', 'hashboard' ),
			$comment_count->approved,
			__( 'Comments', 'hashboard' )
		);
	}

	/**
	 * Render activity block.
	 *
	 * @return string
	 */
	private function render_activity_block() {
		$recent_posts = get_posts( [
			'numberposts' => 5,
			'post_status' => 'publish',
		] );

		$html = '<ul class="list-group list-group-flush">';
		foreach ( $recent_posts as $post ) {
			$html .= sprintf(
				'<li class="list-group-item d-flex justify-content-between align-items-start">
					<div>
						<h6 class="mb-1">%s</h6>
						<small class="text-muted">%s</small>
					</div>
					<span class="badge bg-primary rounded-pill">%d</span>
				</li>',
				esc_html( $post->post_title ),
				get_the_date( '', $post ),
				get_comments_number( $post->ID )
			);
		}
		$html .= '</ul>';

		return $html;
	}

	/**
	 * Render quick links block.
	 *
	 * @return string
	 */
	private function render_quick_links() {
		$links = [
			[ 'url' => admin_url( 'post-new.php' ), 'label' => __( 'New Post', 'hashboard' ), 'icon' => 'dashicons-edit' ],
			[ 'url' => admin_url( 'media-new.php' ), 'label' => __( 'Upload Media', 'hashboard' ), 'icon' => 'dashicons-upload' ],
			[ 'url' => admin_url( 'themes.php' ), 'label' => __( 'Themes', 'hashboard' ), 'icon' => 'dashicons-art' ],
			[ 'url' => admin_url( 'plugins.php' ), 'label' => __( 'Plugins', 'hashboard' ), 'icon' => 'dashicons-plugins-checked' ],
		];

		$html = '<div class="list-group">';
		foreach ( $links as $link ) {
			$html .= sprintf(
				'<a href="%s" class="list-group-item list-group-item-action">
					<span class="dashicons %s"></span> %s
				</a>',
				esc_url( $link['url'] ),
				esc_attr( $link['icon'] ),
				esc_html( $link['label'] )
			);
		}
		$html .= '</div>';

		return $html;
	}

	/**
	 * Render notifications block.
	 *
	 * @return string
	 */
	private function render_notifications() {
		$notifications = [
			[ 'type' => 'info', 'message' => __( 'WordPress is up to date.', 'hashboard' ) ],
			[ 'type' => 'warning', 'message' => __( '2 plugins have updates available.', 'hashboard' ) ],
			[ 'type' => 'success', 'message' => __( 'Backup completed successfully.', 'hashboard' ) ],
		];

		$html = '<div class="notifications-list">';
		foreach ( $notifications as $notification ) {
			$html .= sprintf(
				'<div class="alert alert-%s alert-dismissible fade show" role="alert">
					%s
					<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
				</div>',
				esc_attr( $notification['type'] ),
				esc_html( $notification['message'] )
			);
		}
		$html .= '</div>';

		return $html;
	}

	/**
	 * Register custom style and scripts
	 *
	 * @return void
	 */
	public function register_assets() {
		// Register test assets that blocks can use
		// Use assets/test for built files (from tests/src/js)
		$test_assets_url = plugin_dir_url( dirname( __DIR__ ) ) . 'assets/test/';

		// Register styles (CSS files should be in tests/src/css if using build process)
		wp_register_style( 'hb-test-stats', $test_assets_url . 'dashboard-stats.css', [], '1.0.0' );
		wp_register_style( 'hb-test-notifications', $test_assets_url . 'dashboard-notifications.css', [], '1.0.0' );

		// Register scripts (built from tests/src/js)
		wp_register_script( 'hb-test-activity', $test_assets_url . 'dashboard-activity.js', [ 'jquery', 'hb-components-list-table' ], '1.0.0', true );
		wp_register_script( 'hb-test-chart-init', $test_assets_url . 'dashboard-chart.js', [ 'hb-components-line-chart', 'hb-components-bar-chart' ], '1.0.0', true );
		wp_register_script( 'hb-test-calendar', $test_assets_url . 'dashboard-calendar.js', [ 'jquery', 'hb-components-date-range' ], '1.0.0', true );

		// Localize script for AJAX if needed
		wp_localize_script( 'hb-test-activity', 'hbDashboard', [
			'ajaxurl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'hb-dashboard' ),
		] );
	}
}
