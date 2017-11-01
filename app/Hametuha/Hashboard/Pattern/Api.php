<?php

namespace Hametuha\Hashboard\Pattern;


use Hametuha\Pattern\RestApi;

/**
 * Wrapper for namespace.
 *
 * @package hashbaord
 */
abstract class Api extends RestApi {

	protected $namespace = 'hashboard';

	protected $version   = '1';

}