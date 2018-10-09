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
	 * @param string $page
	 * @return string
	 */
	abstract public function description( $page = '' );

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
	public function meta_description( $page = '' ) {
		$description = $this->description( $page );
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
			/**
			 * hashboard_before_fields_rendered
			 *
			 * Excecuted just after form is rendered.
			 */
			do_action( 'hashboard_before_fields_rendered', $this->slug(), $page, $name );
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
				printf( '<div class="form-row"><div class="col-12"><button class="btn btn-outline-primary ripple" type="submit">%s</button></div></div>', esc_html( $settings[ 'submit' ] ) );
			}
			/**
			 * hashboard_after_fields_rendered
			 *
			 * Excecuted just after form is rendered.
			 */
			do_action( 'hashboard_after_fields_rendered', $this->slug(), $page, $name );
			echo '</fieldset>';
			if ( $settings['submit'] ) {
				echo '</form>';
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
			'name'  => '',
			'value' => '',
			'src'   => '',
			'group' => '',
			'col'   => 1,
			'icon'  => '',
			'html'        => false,
			'placeholder' => '',
            'description' => '',
			'media_type'  => 'image',
			'default' => '',
			'options' => [],
			'rows' => 3,
			'optional' => false,
		], $fields );
		if ( ! $fields['name'] ) {
			$fields['name'] = $key;
		}
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
		if ( $fields['html'] ) {
			echo $fields['html'];
		} else {
			if ( $fields[ 'src' ] ) {
				$fields[ 'value' ] = get_user_meta( $user->ID, $fields['src'], true );
			}
			if ( $fields['icon'] ) {
				$fields['label'] = sprintf(
                    '<i class="material-icons prefix">%s</i>',
                    esc_html( $fields['icon'] )
                ) . $fields['label'];
            }
			if ( ! in_array( $fields['type'], [ 'hidden', 'media', 'file', 'separator' ] ) ) {
				printf(
					'<label for="%s">%s %s</label>',
					esc_attr( $key ),
					wp_kses( $fields['label'],[ 'i' => [ 'class' => true ] ] ),
					$fields['optional'] ? sprintf( '<small class="text-muted">%s</small>', esc_html__( '(Optional)', 'hashboard' ) ) : ''
				);
			}
			switch ( $fields['type'] ) {
				case 'separator':
					printf( '<div class="col s12"><p class="hb-separator">%s</p></div>', wp_kses_post( $fields['label'] ) );
					break;
				case 'textarea':
					$rows = $fields['rows'];
					printf(
						'<textarea id="%1$s" name="%5$s" class="form-control resizable" rows="%4$d" data-min-rows="%4$d" %3$s>%2$s</textarea>',
						esc_attr( $key ),
						esc_textarea( $fields['value'] ),
						$fields['placeholder'] ? sprintf( 'placeholder="%s"', esc_attr( $fields['placeholder'] ) ) : '',
						$fields['rows'],
						esc_attr( $fields['name'] )
					);
					break;
				case 'select':
					printf( '<select id="%1$s" name="%2$s" class="form-control">', esc_attr( $key ), esc_attr( $fields['name'] ) );
					foreach ( $fields['options'] as $v => $l ) {
						$cur = $fields['value'] ?: $fields['default'];
						printf(
							'<option value="%s"%s>%s</option>',
							esc_attr( $v ),
							selected( $cur, $v, false ),
							esc_html( $l )
						);
					}
					echo '</select>';
					break;
				case 'url':
				case 'password':
                case 'email':
				case 'text':
				case 'number':
				case 'hidden':
					printf(
						'<input class="form-control" type="%1$s" id="%2$s" name="%5$s" value="%3$s" %4$s />',
						esc_attr( $fields['type'] ),
						esc_attr( $key ),
						esc_attr( $fields['value'] ),
						$fields['placeholder'] ? sprintf( 'placeholder="%s"', esc_attr( $fields['placeholder'] ) ) : '',
						esc_attr( $fields['name'] )
					);
					break;
				case 'media':
					wp_enqueue_media();
					printf(
						'<input type="hidden" name="%4$s" /><button id="%1$s" class="waves-effect waves-light btn hb-media-helper" data-media-type="%2$s" type="button"><i class="material-icons left">photo</i>%3$s</button>',
						esc_attr( $key ),
						esc_attr( $fields['media_type'] ),
						__( 'Select', 'hashboard' ),
						esc_attr( $fields['name'] )
					);
					break;
				case 'file':
					$lang = explode( '_', get_locale() )[0];
					printf( '
						<div class="custom-file">
							<input type="file" class="custom-file-input" name="%4$s" id="%2$s" lang="%3$s">
							<label class="custom-file-label" for="%2$s">%1$s</label>
						</div>
    				', esc_html( $fields['label'] ), esc_attr( $key ), esc_attr( $lang ), esc_attr( $fields['name'] ) );
					break;
			}
            if ( $fields['description'] ) {
                printf( '<p class="form-text hb-input-description">%s</p>', wp_kses_post( $fields['description'] ) );
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
		if ( ! in_array( $fields['type'], [ 'separator' ] ) ) {
			$out = sprintf(
				'<div class="%s col-12 col-md-%d">%s</div>',
				'file' == $fields['type'] ? 'file-field' : '' ,
				( is_numeric( $fields['col'] ) && $fields['col'] ) ? ceil( 12 / $fields['col'] ) : 12,
			$out );
		}
		if ( 'open' == $fields['group'] ) {
			$out = '<div class="form-row">' . $out;
		} elseif ( 'close' == $fields['group'] ) {
			$out .= '</div>';
		} else {
			$out = '<div class="form-row">' . $out . '</div>';
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
