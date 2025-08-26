<?php

namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard\Pattern\Screen;

/**
 * Dashboard template for Hashcboard
 */
class Dashboard extends Screen {

	/**
	 * Blocks of this page.
	 *
	 * @var array<int, array{id:string, html:string, title:string, size:int, scripts?:array<string>, styles?:array<string>, action?:string, action_label?:string, card_class?:string}>
	 */
	private $blocks = [];

	protected $icon = 'dashboard';

	public function slug() {
		return 'dashboard';
	}

	public function label() {
		return __( 'Dashboard', 'hashboard' );
	}

	public function description( $page = '' ) {
		return apply_filters( 'hashboard_dashboard_description', sprintf( __( 'Welcome to %s!', 'hashboard' ), get_bloginfo( 'name' ) ) );
	}

	/**
	 * Get dashboard blocks.
	 *
	 * @return array
	 */
	protected function get_blocks() {
		$message  = sprintf( esc_html__( 'Welcome to %s dashboard!', 'hashboard' ), get_bloginfo( 'name' ) );
		$welcome  = <<<HTML
			<p>{$message}</p>
HTML;
		$blocks[] = array(
			'id'    => 'welcome',
			'html'  => $welcome,
			'title' => sprintf( __( 'Welcome to %s!', 'hashboard' ), get_bloginfo( 'name' ) ),
			'size'  => 3,
		);
		/**
		 * hashboard_dashboard_blocks
		 *
		 * @param array $blocks
		 * @return array
		 */
		return apply_filters( 'hashboard_dashboard_blocks', $blocks );
	}

	public function head( $child = '' ) {
		parent::head( $child );
		$this->blocks = $this->get_blocks();
		
		// Enqueue scripts and styles for each block
		foreach ( $this->blocks as $block ) {
			// Enqueue scripts
			if ( ! empty( $block['scripts'] ) ) {
				foreach ( $block['scripts'] as $script ) {
					wp_enqueue_script( $script );
				}
			}
			
			// Enqueue styles
			if ( ! empty( $block['styles'] ) ) {
				foreach ( $block['styles'] as $style ) {
					wp_enqueue_style( $style );
				}
			}
		}

		do_action( 'hashboard_dashboard_header' );
	}

	/**
	 * Render HTML
	 *
	 * @param string $page
	 */
	public function render( $page = '' ) {
		?>
		<div class="container-fluid">
			<div class="row" id="hb-dashboard-grid">
				<?php
				foreach ( $this->blocks as $block ) :
					$block = wp_parse_args( $block, array(
						'id'           => '',
						'html'         => '',
						'size'         => 1,
						'title'        => '',
						'action'       => '',
						'action_label' => '',
						'card_class'   => '',
					) );
					$size = max( min( $block['size'], 3 ), 1 );

					// Calculate column class based on size
					$col_class = '';
					switch ( $size ) {
						case 1:
							$col_class = 'col-12 col-md-6 col-lg-4';
							break;
						case 2:
							$col_class = 'col-12 col-md-12 col-lg-8';
							break;
						case 3:
							$col_class = 'col-12';
							break;
					}
					$card_class = [ 'card', 'h-100' ];
					if ( $block['card_class'] ) {
						$card_class[] = $block['card_class'];
					}
					?>
					<div class="<?php echo esc_attr( $col_class ); ?> mb-4">
						<div class="<?php echo esc_attr( implode( ' ', $card_class ) ); ?>" id="<?php echo esc_attr( $block['id'] ); ?>">
							<?php if ( $block['title'] ) : ?>
								<div class="card-header d-flex justify-content-between align-items-center">
									<h2 class="card-title h5 mb-0">
										<?php echo wp_kses_post( $block['title'] ); ?>
									</h2>
									<?php if ( $block['action'] && $block['action_label'] ) : ?>
										<a href="<?php echo esc_url( $block['action'] ); ?>" class="btn btn-sm btn-outline-primary">
											<?php echo esc_html( $block['action_label'] ); ?>
										</a>
									<?php endif; ?>
								</div>
							<?php endif; ?>
							<div class="card-body">
								<?php echo $block['html']; ?>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
	}

	public function footer( $child = '' ) {
		do_action( 'hashboard_dashboard_footer' );
	}
}
