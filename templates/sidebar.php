<?php
/**
 * Sidebar template of hashboard
 *
 * @var \Hametuha\Hashboard $hashboard
 */

?>

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

	<button type="button" class="side-nav-toggle" data-target="#hb-side-nav">
		<i class="material-icons">close</i>
	</button>
</header>
