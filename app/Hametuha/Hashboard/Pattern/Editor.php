<?php

namespace Hametuha\Hashboard\Pattern;


use Hametuha\Hashboard;
use Hametuha\Pattern\Singleton;

/**
 * Editor base
 *
 * @package hashboard
 */
abstract class Editor extends Singleton {

	/**
	 * Object to edit.
	 *
	 * @var mixed
	 */
	protected $object = null;

	protected function init() {
		add_action( 'hashboard_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueue assets
	 */
	public function enqueue_scripts() {
		// Do nothing.
	}

	/**
	 * Get slug.
	 *
	 * @return string
	 */
	abstract protected function get_slug();

	/**
	 * Get page label.
	 *
	 * @return string
	 */
	abstract protected function get_label();

	/**
	 * Back link url
	 *
	 * @return string
	 */
	protected function get_back_link() {
		return Hashboard::screen_url();
	}

	/**
	 * Get object.
	 *
	 * @param int      $object_id Object id.
	 * @param \WP_User $user      Current user.
	 *
	 * @return mixed
	 */
	abstract protected function get_object( $object_id, \WP_User $user );

	/**
	 * Check if user can edit object.
	 *
	 * @param mixed    $object Object to edit.
	 * @param \WP_User $user   Current user.
	 *
	 * @return bool
	 */
	abstract protected function is_editable( $object, \WP_User $user );

	/**
	 * Override  this method if you need something in head tag.
	 */
	public function head() {
		// Do nothing.
	}

	/**
	 * Override  this method if you need something in footer.
	 */
	public function footer() {
		// Do nothing.
	}

	/**
	 * Render body
	 *
	 * @param int      $object_id Object ID to edit.
	 * @param \WP_User $user      Current User.
	 * @throws \Exception         Throw exception if any error occurred.
	 */
	public function render( $object_id, \WP_User $user ) {
		$this->object = $this->get_object( $object_id, $user );
		if ( ! $this->object ) {
			throw new \Exception( 'Not found.', 404 );
		}
		if ( ! $this->is_editable( $this->object, $user ) ) {
			throw new \Exception( __( 'You have no permission to edit this data.', 'hashboard' ), 403 );
		}
		// Enqueueu many things.
		wp_enqueue_style( 'bootstrap' );
		wp_enqueue_script( 'hashboard' );
		do_action( 'hashboard_enqueue_scripts' );
		Hashboard::load_template( 'editor.php', array(
			'editor'   => $this,
			'page'     => $this->get_slug(),
			'object'   => $this->object,
			'label'    => $this->get_label(),
			'back_url' => $this->get_back_link(),
			'child'    => get_query_var( 'hashboard-child' ),
		) );
	}

	/**
	 * Render content.
	 *
	 * @return string
	 */
	abstract public function content();

	/**
	 * Register editor.
	 */
	public static function register() {
		$slug       = static::get_instance()->get_slug();
		$class_name = get_called_class();
		add_filter( 'hashboard_editors', function ( $editors ) use ( $slug, $class_name ) {
			if ( ! isset( $editors[ $slug ] ) ) {
				$editors[ $slug ] = $class_name;
			}
			return $editors;
		} );
	}
}
