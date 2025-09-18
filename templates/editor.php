<?php
/**
 * Editor Template.
 * @var array{
 *     label:string,
 *     back_url:string,
 *     page:string,
 *     child:string,
 *     editor:\Hametuha\Hashboard\Pattern\Editor,
 *     object:mixed
 * } $args
 */
$user = wp_get_current_user();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>"/>
	<title><?php echo esc_html( $args['label'] ); ?> | <?php bloginfo( 'name' ); ?></title>
	<?php
	$args['editor']->head( $args['child'] );
	$args['editor']->enqueue_scripts();
	do_action( 'wp_head' );
	?>
</head>
<body><?php wp_body_open(); ?>

<div>
	<nav class="top-nav top-nav-over">
		<div class="hb-container">
			<div class="nav-wrapper hb-nav-wrapper">
				<span class="hb-header-title">
					<?php echo esc_html( $args['label'] ); ?>
				</span>
				<a title="<?php esc_attr_e( 'Return', 'hashboard' ); ?>" class="btn btn-circle btn-sm btn-link btn-floating waves-effect"
					href="<?php echo esc_url( $args['back_url'] ); ?>">
					<i class="material-icons">chevron_left</i>
				</a>
			</div>
		</div>
	</nav>
	<div class="hb-main hb-main-editor" data-text="<?php esc_attr_e( 'Please wait...', 'hashboard' ); ?>">
		<div class="hb-container">
			<div class="hb-main-inner">
				<?php
				/**
				 * hashboard_before_main
				 *
				 * Display something before main container
				 *
				 * @param \Hametuha\Hashboard\Pattern\Screen $editor
				 * @param string $child
				 */
				do_action( 'hashboard_before_main', $args['editor'], $args['child'] );

				$args['editor']->content();

				/**
				 * hashboard_after_main
				 *
				 * Display something just after main container
				 *
				 * @param \Hametuha\Hashboard\Pattern\Screen $page
				 * @param string $child
				 */
				do_action( 'hashboard_after_main', $args['editor'], $args['child'] );
				?>
			</div>
		</div>
	</div>

</div>
<?php $args['editor']->footer( $args['child'] ); ?>
<?php do_action( 'wp_footer' ); ?>
</body>
</html>
