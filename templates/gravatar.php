<?php
/* @var WP_User $user */
?>
<div class="hb-gravatar">
	<?php echo get_avatar( $user->ID, 96, '', '', array( 'class' => 'hb-gravatar-img rounded mx-auto d-block' ) ); ?>
	<p class="hb-gravatar-description hb-input-description">
		<?php echo wp_kses_post( sprintf( __( 'Your profile picture is displayed via <a href="%s">Gravatar</a> based on your email.', 'hashboard' ), 'https://gravatar.com/' ) ); ?>
	</p>
</div>
