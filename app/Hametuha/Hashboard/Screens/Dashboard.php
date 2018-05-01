<?php

namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard\Pattern\Screen;

class Dashboard extends Screen {

	protected $icon = 'dashboard';

	public function slug() {
		return 'dashboard';
	}

	public function label() {
		return __( 'Dashboard', 'hashboard' );
	}

	public function description( $page = '' ) {
		return sprintf( __( 'Welcome to %s!', 'hashboard' ), get_bloginfo( 'name' ) );
	}

	/**
     * Get dashboard blocks.
     *
	 * @return array
	 */
	protected function get_blocks() {
	    $message = sprintf( esc_html__( 'Welcom to %s dashboard!', 'hashboard' ), get_bloginfo( 'name' ) );
		$welcome = <<<HTML
            <div class="card">
                <div class="card-content">
                    <p>{$message}</p>
                </div>
            </div>
HTML;
		$blocks[] = [
			'id'   => 'welcome',
            'html' => $welcome,
            'title' => sprintf( __( 'Welcome to %s!', 'hashboard' ), get_bloginfo( 'name' ) ),
            'size' => 3,
		];
		/**
		 * hashboard_dashboard_blocks
		 *
		 * @param array $blocks
		 * @return array
		 */
		return apply_filters( 'hashboard_dashboard_blocks', $blocks );
	}

	/**
	 * Render HTML
	 *
	 * @param string $page
	 */
	public function render( $page = '' ) {
		?>
		<div class="hb-masonry" id="hb-dashboard-masonry">
            <div class="hb-masonry-sizer"></div>
			<?php foreach ( (array) $this->get_blocks() as $block ) :
                $block = wp_parse_args( $block, [
                    'id' => '',
                    'html' => '',
                    'size' => 1,
                    'title' => '',
                ] );
			    $size = max( min( $block['size'], 3), 1 );
                ?>
				<div class="hb-masonry-block" id="<?= esc_attr( $block['id'] ) ?>" data-size="<?= esc_attr( $size ) ?>">
                    <div class="hb-masonry-inner">
						<?php if ( $block[ 'title' ] ) : ?>
                            <h3 class="hb-masonry-title"><?= wp_kses( $block[ 'title' ], [ 'a' => [ 'href' => true, 'target' => [ '_self', '_blank' ] ], 'strong' => true, 'i' => [ 'class' => true ] ] ) ?></h3>
						<?php endif; ?>
                        <div class="hb-masonry-content">
							<?php echo $block[ 'html' ]; ?>
                        </div>
                    </div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
	}

	/**
	 * Footer action
	 */
	public function footer() {
		wp_enqueue_script( 'hb-components-dashboard' );
	}


}