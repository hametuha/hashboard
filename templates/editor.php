<?php
/** @var \Hametuha\Hashboard\Pattern\Editor $editor */
/** @var string $label */
/** @var string $back_url */
/** @var string $child */
$user = wp_get_current_user();
?><!doctype html>
<html>
<head>
	<meta charset="<?php bloginfo( 'charset' ) ?>"/>
	<title><?php echo esc_html( $label ) ?> | <?php bloginfo( 'name' ) ?></title>
	<?php
	$editor->head();
	do_action( 'hashboard_head', $editor );
	?>
</head>
<body>

<section>
	<nav class="top-nav top-nav-over">
		<div class="hb-container">
			<div class="nav-wrapper hb-nav-wrapper">
                <span class="hb-header-title">
                    <?php echo esc_html( $label ) ?>
                </span>
				<a title="<?php esc_attr_e( 'Return', 'hashboard' ) ?>" class="btn btn-circle btn-sm btn-link btn-floating waves-effect"
					href="<?= esc_url( $back_url ) ?>">
					<i class="material-icons">chevron_left</i>
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
				do_action( 'hashboard_before_main', $editor, $child );

				$editor->content();
				
				/**
				 * hashboard_after_main
				 *
				 * Display something just after main container
				 *
				 * @param \Hametuha\Hashboard\Pattern\Screen $page
				 * @param string $child
				 */
				do_action( 'hashboard_after_main', $editor	, $child );
				?>

			</div>
		</div>
	</div>

</section>
<?php $editor->footer() ?>
<?php do_action( 'hashboard_footer', $page ) ?>
</body>
</html>
