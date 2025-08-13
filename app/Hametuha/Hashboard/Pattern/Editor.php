<?php

namespace Hametuha\Hashboard\Pattern;


use Hametuha\Hashboard;

/**
 * Editor base
 *
 * @package hashboard
 */
abstract class Editor extends ScreenPattern {

	/**
	 * Object to edit.
	 *
	 * @var mixed
	 */
	protected $object = null;

	/**
	 * Enqueue assets
	 */
	public function enqueue_scripts() {
		// Do nothing.
	}

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
		Hashboard::load_template( 'editor.php', array(
			'editor'   => $this,
			'page'     => $this->slug(),
			'object'   => $this->object,
			'label'    => $this->label(),
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
		$slug       = static::get_instance()->slug();
		$class_name = get_called_class();
		add_filter( 'hashboard_editors', function ( $editors ) use ( $slug, $class_name ) {
			if ( ! isset( $editors[ $slug ] ) ) {
				$editors[ $slug ] = $class_name;
			}
			return $editors;
		} );
	}
}
