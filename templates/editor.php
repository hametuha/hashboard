<?php
/** @var \Hametuha\Hashboard\Pattern\Editor $editor */
/** @var string $label */
/** @var string $back_url */
$user = wp_get_current_user();

?><!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ) ?>"/>
	<title><?php echo esc_html( $label ) ?> | <?php bloginfo( 'name' ) ?></title>
	<?php
	$editor->head();
	wp_styles()->do_items( false );
	?>
</head>
<body>

<section>
	<nav class="top-nav top-nav-over">
		<div class="hb-container">
			<div class="nav-wrapper hb-nav-wrapper">
                <span class="hb-main-title page-title">
                    <?php echo esc_html( $label ) ?>
                </span>
				<a title="<?php esc_attr_e( 'Return', 'hashboard' ) ?>" class="btn-floating waves-effect waves-dark grey lighten-4"
					href="<?= esc_url( $back_url ) ?>">
					<i class="material-icons grey-text text-darken-2">chevron_left</i>
				</a>
			</div>
		</div>
	</nav>
	<div class="hb-main" data-text="<?php esc_attr_e( 'Please wait...', 'hashboard' ) ?>">
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

				$editor->content();
				
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

</section>
<?php $editor->footer() ?>
<?php wp_scripts()->do_footer_items() ?>
</body>
</html>
