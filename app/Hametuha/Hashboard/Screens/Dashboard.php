<?php

namespace Hametuha\Hashboard\Screens;


use Hametuha\Hashboard\Pattern\Screen;

class Dashboard extends Screen {

	protected $icon = 'dashboard';

	public function slug() {
		return 'dashboard';
	}

	public function label() {
		return __( 'Dashboard', 'hashboard' );
	}

	public function description() {
		return sprintf( __( 'Welcome to %s!', 'hashboard' ), get_bloginfo( 'name' ) );
	}


}