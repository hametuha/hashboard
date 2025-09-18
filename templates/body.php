<?php
/** @var array{page:\Hametuha\Hashboard\Pattern\Screen, hashboard: \Hametuha\Hashboard, child: string} $args */
$user      = wp_get_current_user();
$page      = $args['page'];
$hashboard = $args['hashboard'];
$child     = $args['child'] ?: '';
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<?php
	$page->head( $child );
	do_action( 'wp_head' );
	?>
</head>
<body><?php wp_body_open(); ?>

<?php include __DIR__ . '/sidebar.php'; ?>

<main class="hb with-side-nav">
	<nav class="top-nav">
		<div class="hb-container">
			<div class="nav-wrapper">
				<span class="hb-header-title page-title">
					<?php echo esc_html( $page->label() ); ?>
				</span>

				<button id="hb-side-nav-toggle" data-target="#hb-side-nav" type="button"
						class="side-nav-toggle hb-header-menu">
					<i class="material-icons">menu</i>
				</button>

				<div class="hb-header-dropdown btn-group">
					<button class="dropdown hb-header-dropdown-trigger" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<?php
						echo get_avatar( get_current_user_id(), 96, '', $user->display_name, array(
							'class' => 'circle responsive-img hb-header-avatar',
						) )
						?>
					</button>
					<div id="hb-sub-menu" class="dropdown-menu dropdown-menu-right hb-header-dropdown-menu">
						<?php foreach ( $hashboard->user_actions() as $link ) : ?>
							<?php if ( 'divider' === $link['label'] ) : ?>
								<div class="dropdown-divider"></div>
							<?php else : ?>
								<a href="<?php echo esc_url( $link['url'] ); ?>"
									class="dropdown-item <?php echo isset( $link['class'] ) ? esc_attr( $link['class'] ) : ''; ?>">
									<?php echo wp_kses_post( $link['label'] ); ?>
								</a>
							<?php endif; ?>
						<?php endforeach; ?>
					</div>
				</div>

			</div>
		</div>
	</nav>
	<?php
	$desc = $page->description( $child );
	$desc = apply_filters( 'hashboard_page_description', $desc, $page, $child );
	if ( $desc ) :
		?>
	<div class="hb-main-desc">
		<?php echo wpautop( $desc ); ?>
	</div><!-- // .hb-main-desc -->
	<?php endif; ?>
	<div class="hb-main" data-text="<?php esc_attr_e( 'Please wait...', 'hashboard' ); ?>">
		<div class="hb-container">
			<div class="hb-main-inner">
				<?php
				/**
				 * hashboard_before_main
				 *
				 * Display something before main container
				 *
				 * @param \Hametuha\Hashboard\Pattern\Screen $page
				 * @param string $child
				 */
				do_action( 'hashboard_before_main', $page, $child );

				$page->render( $child );

				/**
				 * hashboard_after_main
				 *
				 * Display something just after main container
				 *
				 * @param \Hametuha\Hashboard\Pattern\Screen $page
				 * @param string $child
				 */
				do_action( 'hashboard_after_main', $page, $child );
				?>

			</div>
		</div>
	</div>

</main>
<?php
$page->footer( $child );
do_action( 'wp_footer' );
?>
</body>
</html>
