<?php

namespace Hametuha\Hashboard\Tests;


use Hametuha\SingletonPattern\Singleton;

/**
 * Bootstrap class for tests
 *
 *
 */
class Bootstrap extends Singleton {

	/**
	 * {@inheritDoc}
	 */
	protected function init() {
		add_filter( 'show_admin_bar', '__return_false' );
		add_filter( 'hashboard_screens', [ $this, 'register_screens' ] );

		// Claude用の自動ログイン（ローカル開発環境のみ）
		add_action( 'init', [ $this, 'auto_login_for_claude' ], 1 );

		// カスタムダッシュボード
		CustomDashboard::get_instance();
	}

	public function register_screens( $screens ) {
		$screens['kitchen-sink'] = KitchenSink::class;
		return $screens;
	}

	/**
	 * Claude用の自動ログイン機能
	 * ローカル開発環境でのみ動作し、Claude識別ヘッダーがある場合に自動ログインを実行
	 */
	public function auto_login_for_claude() {
		// セキュリティチェック：ローカル環境でのみ動作
		if ( wp_get_environment_type() !== 'local' || ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			return;
		}

		// 既にログインしている場合はスキップ
		if ( is_user_logged_in() ) {
			return;
		}

		// Claude識別ヘッダーをチェック
		if ( empty( $_SERVER['HTTP_X_CLAUDE_DEBUG'] ) ) {
			return;
		}

		// claude ユーザーを取得または作成
		$user = get_user_by( 'login', 'claude' );
		if ( ! $user ) {
			$user_id = wp_create_user( 'claude', wp_generate_password(), 'claude@local.dev' );
			if ( is_wp_error( $user_id ) ) {
				error_log( 'Failed to create claude user: ' . $user_id->get_error_message() );
				return;
			}

			$user = get_user_by( 'id', $user_id );
			if ( ! $user ) {
				error_log( 'Failed to retrieve created claude user' );
				return;
			}

			// ユーザーメタを設定
			update_user_meta( $user_id, 'description', 'Auto-generated user for Claude development debugging' );
			update_user_meta( $user_id, 'show_admin_bar_front', false );
		}

		// ログイン実行
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID, true );

		// デバッグログ
		error_log( sprintf( 'Claude auto-login: User ID %d logged in via X-Claude-Debug header', $user->ID ) );
	}
}
