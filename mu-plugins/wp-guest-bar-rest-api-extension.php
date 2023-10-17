<?php

declare(strict_types=1);

namespace E2E\WpGuestBar;

use WP_REST_Request;
use WP_REST_Server;

const REST_NAMESPACE = '/e2e/v1';
const REST_ROUTE = '/wp-guest-bar';
const OPTION_KEY = 'wpgov_wpgb';

// We need to change the plugin's settings during the tests.
// One way would be to use the settings page the plugin makes available.
// However, using the REST API is way more convenient, even if we have to register an endpoint ourselves.
//
// WooCommerce Blocks takes a different route; they use the WP CLI wherever that's more handy.
// https://github.com/woocommerce/woocommerce-blocks/blob/c18de3995495e00412723348a10313e143ca37d9/tests/e2e/utils/cli.ts
// https://github.com/woocommerce/woocommerce-blocks/blob/9d9f8672f82a465f448200634b0da41e18897f02/tests/e2e/tests/price-filter/price-filter.block_theme.side_effects.spec.ts#L99-L101
add_action(
    'rest_api_init',
    function () {
        $isUserLikelyAdmin = fn() => current_user_can('manage_options');

        register_rest_route(
            route_namespace: REST_NAMESPACE,
            route: REST_ROUTE,
            args: [
                'methods' => WP_REST_Server::READABLE,
                'callback' => fn() => get_option(OPTION_KEY),
                'permission_callback' => $isUserLikelyAdmin,
            ]
        );

        register_rest_route(
            route_namespace: REST_NAMESPACE,
            route: REST_ROUTE,
            args: [
                'methods' => WP_REST_Server::EDITABLE,
                // We are not doing any validation here, and we know it!
                'callback' => fn(WP_REST_Request $request) => update_option(
                    OPTION_KEY,
                    json_decode($request->get_body(), true)
                ),
                'permission_callback' => $isUserLikelyAdmin,
            ]
        );

        register_rest_route(
            route_namespace: REST_NAMESPACE,
            route: REST_ROUTE,
            args: [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => fn() => delete_option(OPTION_KEY),
                'permission_callback' => $isUserLikelyAdmin,
            ]
        );
    }
);
