<?php
/** @var \Hametuha\Hashboard\Pattern\Screen $page */
/** @var \Hametuha\Hashboard $hashboard */
/** @var string $child */
$user = wp_get_current_user();

?><!doctype html>
<html>
<head>
    <meta charset="<?php bloginfo( 'charset' ) ?>"/>
    <title><?php echo esc_html( $page->label() ) ?> | <?php bloginfo( 'name' ) ?></title>
    <meta name="description" content="<?php echo esc_attr( $page->meta_description( $child ) ) ?>"/>
    <?php $page->head(); ?>
	<?php do_action( 'hashboard_head', $page ) ?>
    <?php wp_styles()->do_items( false ) ?>
</head>
<body>

<header class="hb-header">
    <ul class="hb-menu side-nav fixed">
        <li class="hb-site-info">
            <?php if ( has_site_icon() ) : ?>
                <img src="<?php site_icon_url() ?>" alt="<?php bloginfo( 'name' ) ?>" class="hb-site-icon"/>
            <?php endif; ?>
            <span class="hb-site-name"><?php bloginfo( 'name' ) ?></span>
        </li>
        <li class="divider"></li>
		<?php foreach ( $hashboard->screens as $screen ) :
			/** @var \Hametuha\Hashboard\Pattern\Screen $instance */
			$instance = $screen::get_instance();
			?>
            <li class="hb-menu-item<?php echo $hashboard->current == $instance->slug() ? ' active toggle' : '' ?>">
                <?php if ( ! $instance->get_children() ) : ?>
                <a href="<?php echo esc_url( $hashboard->get_url( $instance ) ) ?>">
					<?php echo wp_kses_post( $instance->get_link_label() ) ?>
                </a>
                <?php else : ?>
                <a href="#" class="hb-submenu-trigger">
					<?php echo wp_kses_post( $instance->get_link_label() ) ?>
                    <i class="material-icons close right">expand_less</i>
                    <i class="material-icons open right">expand_more</i>
                </a>
                <ul class="hb-submenu-list">
                    <?php foreach ( $instance->get_children() as $key => $label ) : ?>
                        <li>
                            <a href="<?php echo esc_url( $hashboard->get_url( $instance, $key == $instance->slug() ? '' : $key ) ) ?>">
                                <?php echo esc_html( $label ) ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </li>
		<?php endforeach; ?>
        <li class="divider"></li>
        <li class="hb-return-link">
            <a href="<?php echo home_url() ?>">
                <i class="material-icons">arrow_back</i> <?php esc_html_e( 'Return to Site', 'hashboard' ) ?>
            </a>
        </li>
    </ul>
</header>

<main>
    <nav class="top-nav">
        <div class="hb-container">
            <div class="nav-wrapper">
                <span class="hb-main-title page-title">
                    <?php echo esc_html( $page->label() ) ?>
                </span>
                <ul class="left hide-on-large-only">
                    <li><a href="#hoge"><i class="material-icons">menu</i></a> </li>
                </ul>
                <ul class="right">
                    <li>
                        <a href="#" data-activates="hb-sub-menu" class="dropdown-button" data-beloworigin="true" data-alignment="right" data-constrainWidth="false">
                            <?php echo get_avatar( get_current_user_id(), 96, $user->display_name, $user->display_name, [
                                'class' => 'circle responsive-img hb-header-avatar',
                            ] ) ?>
                        </a>
                        <ul id='hb-sub-menu' class='dropdown-content'>
                            <?php foreach ( $hashboard->user_actions() as $link ) : ?>
                                <?php if ( 'divider' ===  $link['label'] ) : ?>
                                    <li class="divider"></li>
                                <?php else : ?>
                                    <li>
                                        <a href="<?php echo esc_url( $link['url'] ) ?>" class="<?php echo isset( $link['class'] ) ? esc_attr( $link['class'] ) : '' ?>">
                                            <?php echo wp_kses_post( $link['label'] ) ?>
                                        </a>
                                    </li>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <?php
    $desc = $page->description( $child );
    $desc = apply_filters( 'hashboard_page_description', $desc, $page, $child );
    if ( $desc ) : ?>
    <div class="hb-main-desc">
        <?php echo wpautop( $desc ) ?>
    </div><!-- // .hb-main-desc -->
    <?php endif; ?>
    <div class="hb-main" data-text="<?php esc_attr_e( 'Please wait...', 'hashboard' ) ?>">
        <div class="hb-container">
            <div class="hb-main-inner">
                <?php $page->render( $child ) ?>
            </div>
        </div>
    </div>

</main>
<?php $page->footer() ?>
<?php do_action( 'hashboard_footer', $page ) ?>
<?php wp_scripts()->do_footer_items() ?>
</body>
</html>
