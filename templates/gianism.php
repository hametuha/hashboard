<?php
use Hametuha\Hashboard;

/** @var WP_User $user */
$service_manager = \Gianism\Helper\ServiceManager::get_instance();


// Filter for button style
add_filter( 'hashboard_gianism_button', function( $html ) {
    $html = preg_replace( '#<i [^>]*></i>#u', '', $html );
    $html = preg_replace_callback( '# class="([^"]+)"#', function( $matches ) {
        if ( false !== strpos( $matches[1], 'disconnect' ) ) {
            $class_name = 'waves-effect waves-red btn-flat';
        } else {
           $class_name = 'waves-effect waves-light btn';
        }
        return sprintf( ' class="%s"', esc_attr( $class_name ) );
    }, $html );
    return $html;
} );

foreach( $service_manager->service_list() as $service ) :
	if ( ! $service['enabled'] ) {
		continue;
	}
	$service_instance = $service_manager->get( $service['name'] );
	$is_connected = $service_instance->is_connected( $user->ID );
?>
    <div class="hb-gianism-wrapper">

    <div class="hb-gianism-title">
        <i class="lsf lsf-<?= esc_attr( $service_instance->service_name ) ?>"></i> <?= esc_html( $service_instance->verbose_service_name ) ?>
    </div>
        <div class="hb-giasnim-status">
            <p class="description">
                <?= esc_html( $service_instance->connection_message( $is_connected ? 'connected' : 'disconnected' ) ) ?>
            </p>
        </div>
        <div class="hb-giansim-button">
            <?php if ( ! $is_connected ) {
				echo apply_filters( 'hashboard_gianism_button', $service_instance->connect_button( Hashboard::screen_url( 'account/sns' ) ) );
			} elseif ( $service_instance->is_pseudo_mail( $user->user_email ) )  {
                echo wp_kses_post( sprintf(
                    '<p>'. __( 'You mail is generated automatically by SNS login and invalid. Please change it at <a href="%s">account setting</a>.', 'hashboard' ) . '</p>',
                    \Hametuha\Hashboard::url( '/account' )
                ) );
            } else {
                echo apply_filters( 'hashboard_gianism_button', $service_instance->disconnect_button( Hashboard::screen_url( 'account/sns' ) ) );
            } ?>
        </div>
    </div>

<?php endforeach; ?>
