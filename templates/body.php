<?php
/** @var array{page:\Hametuha\Hashboard\Pattern\Screen, hashboard: \Hametuha\Hashboard, child: string} $args */
$user      = wp_get_current_user();
$page      = $args['page'];
$hashboard = $args['hashboard'];
$child     = $args['child'];
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<?php
	$page->head();
	do_action( 'wp_head' );
	?>
</head>
<body><?php wp_body_open(); ?>

<header class="hb-sidebar" id="hb-side-nav">
	<ul id="nav-mobile" class="hb-menu side-nav fixed">
		<li class="hb-site-info">
			<?php if ( has_site_icon() ) : ?>
				<img src="<?php site_icon_url(); ?>" alt="<?php bloginfo( 'name' ); ?>" class="hb-site-icon"/>
			<?php endif; ?>
			<span class="hb-site-name"><?php bloginfo( 'name' ); ?></span>
		</li>
		<li class="divider"></li>
		<?php
		$lists = array();
		foreach ( $hashboard->screens as $screen ) :
			/** @var \Hametuha\Hashboard\Pattern\Screen $instance */
			$instance = $screen::get_instance();
			ob_start();
			?>
			<li class="hb-menu-item<?php echo $hashboard->current === $instance->slug() ? ' active toggle' : ''; ?>">
				<?php if ( ! $instance->get_children() ) : ?>
				<a href="<?php echo esc_url( $hashboard->get_url( $instance ) ); ?>">
					<?php echo wp_kses_post( $instance->get_link_label() ); ?>
				</a>
				<?php else : ?>
				<a href="#" class="hb-submenu-trigger">
					<?php echo wp_kses_post( $instance->get_link_label() ); ?>
					<i class="material-icons close right">expand_less</i>
					<i class="material-icons open right">expand_more</i>
				</a>
				<ul class="hb-submenu-list">
					<?php foreach ( $instance->get_children() as $key => $label ) : ?>
						<li class="hb-submenu-item">
							<a class="hb-submenu-link" href="<?php echo esc_url( $hashboard->get_url( $instance, $key === $instance->slug() ? '' : $key ) ); ?>">
								<?php echo esc_html( $label ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
				<?php endif; ?>
			</li>
			<?php
			$lists[ $instance->slug() ] = ob_get_contents();
			ob_end_clean();
		endforeach;
		$lists = apply_filters( 'hashboard_sidebar_links', $lists );
		echo implode( "\n", $lists );
		?>
		<li class="divider"></li>
		<li class="hb-return-link">
			<a href="<?php echo home_url(); ?>">
				<i class="material-icons">arrow_back</i> <?php esc_html_e( 'Return to Site', 'hashboard' ); ?>
			</a>
		</li>
	</ul>
</header>

<main class="hb">
	<nav class="top-nav">
		<div class="hb-container">
			<div class="nav-wrapper">
				<span class="hb-header-title page-title">
					<?php echo esc_html( $page->label() ); ?>
				</span>
				<button id="hb-side-nav-toggle" data-target="#hb-side-nav" type="button"
						class="d-md-none side-nav-toggle hb-header-menu">
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
$page->footer();
do_action( 'wp_footer' );
?>
</body>
</html>
