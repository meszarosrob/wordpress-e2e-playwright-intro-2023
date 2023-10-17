import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

export class WpGuestBar {
    // We registered this endpoint in the /mu-plugins/wp-guest-bar-rest-api-extension.php.
    readonly restApiEndpointPath: string = '/e2e/v1/wp-guest-bar';
    requestUtils: RequestUtils;

    // We are introducing this project-specific util for demonstration.
    // Having these REST API calls inlined would be perfectly fine.
    constructor(requestUtils: RequestUtils) {
        this.requestUtils = requestUtils;
    }

    async customMessage() {
        return await this.requestUtils.rest({
            path: this.restApiEndpointPath,
            method: 'GET',
        });
    }

    async setCustomMessage(message: string) {
        return await this.requestUtils.rest({
            path: this.restApiEndpointPath,
            method: 'POST',
            data: {
                message,
            },
        });
    }

    async deleteCustomMessage() {
        return await this.requestUtils.rest({
            path: this.restApiEndpointPath,
            method: 'DELETE',
        });
    }
}
