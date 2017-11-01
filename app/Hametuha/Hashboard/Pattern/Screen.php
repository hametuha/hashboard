<?php
namespace Hametuha\Hashboard\Pattern;

use Hametuha\Pattern\Singleton;


/**
 * Screen
 * @package hashboard
 */
abstract class Screen extends Singleton {

	protected $icon = '';

	/**
	 * @var array
	 */
	protected $children = [];

	/**
	 * Should return unique URL slug.
	 *
	 * @return string
	 */
	abstract public function slug();

	/**
	 * Should return string.
	 *
	 * @return string
	 */
	abstract public function label();

	/**
	 * Show link in navigation.
	 *
	 * @return string
	 */
	public function get_link_label() {
		$label = $this->label();
		if ( $this->icon ) {
			$label = sprintf( '<i class="material-icons">%s</i> %s', $this->icon, $label );
		}
		return $label;
	}

	/**
	 * Get description of this screen.
	 *
	 * @return string
	 */
	abstract public function description();

	/**
	 * Executed inside constructor.
	 */
	protected function init() {
		$this->children = apply_filters( 'hashboard_screen_children', $this->default_children(), $this->slug() );
	}

	/**
	 * Set children.
	 */
	protected function default_children() {
	    return [];
    }

	/**
     * Get children menu
     *
	 * @return array
	 */
	public function get_children() {
		return $this->children;
    }

	/**
     * Render title
     *
	 * @param string $title
	 */
    protected function render_title( $title ) {
		printf(
			'<div class="row"><div class="col col-sm-12"><h2 class="hb-section-title">%s</h2></div></div>',
			wp_kses_post( $title )
		);
    }

	/**
     * Get children
     *
	 * @param string $key
	 * @return bool
	 */
	public function has_children( $key ) {
	    return isset( $this->children[ $key ] );
    }

	/**
	 * Get meta description
	 *
	 * @return string
	 */
	public function meta_description() {
		$description = $this->description();
		return strip_tags( str_replace( "\n", '', $description ) );
	}

	/**
	 * Render HTML
     *
     * @param string $page
	 */
	public function render( $page = '' ) {
		foreach ( $this->get_field_group_filtered( wp_get_current_user(), $page ) as $name => $settings ) {
			$settings = wp_parse_args( $settings, [
				'label' => '',
				'description' => '',
				'fields' => [],
				'action' => '',
				'method' => 'get',
				'submit' => __( 'Save', 'hashboard' ),
			] );
			if ( $settings['submit'] ) {
				printf( '<form class="hb-form" id="form-%s" action="%s" method="%s">', esc_attr( $name ), esc_url( $settings['action'] ), esc_attr( $settings['method'] ) );
			}
			printf( '<fieldset id="fieldset-%s" class="hb-fieldset">', esc_attr( $name ) );
			if ( $settings['label'] ) {
				printf( '<legend>%s</legend>', esc_html( $settings['label'] ) );
			}
			if ( isset( $settings['description'] ) && $settings['description'] ) {
				printf( '<div class="hb-fieldset-description">%s</div>', wp_kses_post( $settings['description'] ) );
			}
			foreach ( $settings['fields'] as $key => $field ) {
				$this->render_field( wp_get_current_user(), $key, $field );
			}
			if ( $settings['submit'] ) {
			    printf( '<div class="row"><div class="col s12"><button class="btn waves-effect waves-light" type="submit">%s</button></div></div>', esc_html( $settings['submit'] ) );
				echo '</fieldset>';
				echo '</form>';
			} else {
				echo '</fieldset>';
			}
		}
	}

	/**
	 * Get field group
	 *
	 * @param null|\WP_User $user
     * @param string        $page
	 * @return array
	 */
	public function get_field_groups( $user = null, $page = '' ) {
		return [];
	}

	/**
     * Get field group filtered.
     *
	 * @param null $user
	 * @param string $page
	 * @return array
	 */
	public function get_field_group_filtered( $user = null, $page = '' ) {
		/**
		 * hashboard_field_groups
		 *
		 * @param array $groups
		 * @param \WP_User $user
		 * @param string $slug
		 * @param string $page
		 * @return array
		 */
		return apply_filters( 'hashboard_field_groups', $this->get_field_groups( $user, $page ), $user, $this->slug(), $page );
	}


	/**
     * Render field for user.
     *
	 * @param \WP_User $user
	 * @param string   $key
	 * @param array    $fields
	 */
	protected function render_field( $user, $key, $fields ) {
		$fields = shortcode_atts( [
			'label' => '',
			'type'  => 'text',
			'value' => '',
			'src'   => '',
			'group' => '',
			'col'   => 1,
			'icon'  => '',
			'placeholder' => '',
            'description' => '',
		], $fields );

		$out = '';
        ob_start();
		/**
		 * hashboard_before_field_rendered
		 *
		 * @param string   $key    of field.
		 * @param array    $fields
		 * @param \WP_User $user
		 */
		do_action( 'hashboard_before_field_rendered', $key, $fields, $user );
		// If HTML is set, render it.
		if ( isset( $fields['html'] ) ) {
			echo $fields['html'];
		} else {
			if ( $fields[ 'src' ] ) {
				$fields[ 'value' ] = get_user_meta( $user->ID, $fields['src'], true );
			}
			if ( $fields['icon'] ) {
				printf(
                    '<i class="material-icons prefix">%s</i>',
                    esc_html( $fields['icon'] )
                );
            }
			switch ( $fields['type'] ) {
				case 'textarea':
					printf(
						'<textarea id="%1$s" name="%1$s" class="materialize-textarea" %3$s>%2$s</textarea>',
						esc_attr( $key ),
						esc_textarea( $fields['value'] ),
						$fields['placeholder'] ? sprintf( 'placeholder="%s"', esc_attr( $fields['placeholder'] ) ) : ''
					);
					break;
				case 'url':
				case 'password':
                case 'email':
				case 'text':
				case 'number':
				case 'hidden':
					printf(
						'<input type="%1$s" id="%2$s" name="%2$s" value="%3$s" %4$s />',
						esc_attr( $fields['type'] ),
						esc_attr( $key ),
						esc_attr( $fields['value'] ),
						$fields['placeholder'] ? sprintf( 'placeholder="%s"', esc_attr( $fields['placeholder'] ) ) : ''
					);
					break;
			}
			if ( 'hidden' !== $fields['type'] ) {
				printf( '<label for="%s">%s</label>', esc_attr( $key ), wp_kses( $fields['label'], [ 'i' => [ 'class' => true ] ] ) );
			}
            if ( $fields['description'] ) {
                printf( '<p class="hb-input-description">%s</p>', wp_kses_post( $fields['description'] ) );
            }
		}
		/**
         * hashboard_after_field_rendered
         *
		 * @param string   $key    of field.
         * @param array    $fields
         * @param \WP_User $user
		 */
		do_action( 'hashboard_after_field_rendered', $key, $fields, $user );
        $out = ob_get_contents();
        ob_end_clean();
		// Wrap fields.
		$out = sprintf( '<div class="input-field col s%d">%s</div>', ceil( 12 / $fields['col'] ), $out );
		if ( 'open' == $fields['group'] ) {
			$out = '<div class="row">' . $out;
		} elseif ( 'close' == $fields['group'] ) {
			$out .= '</div>';
		} else {
			$out = '<div class="row">' . $out . '</div>';
		}
		echo $out;
	}

	/**
	 * Head action
	 */
	public function head(){
		// Do something.
	}

	/**
	 * Footer action
	 */
	public function footer(){
		// Do somehting.
	}
}
