// To get autocompletion in TypeScript when the environmental variables are referenced.
declare namespace NodeJS {
    interface ProcessEnv {
        WP_AUTH_STORAGE: string;
        WP_BASE_URL: string;
        WP_USERNAME: string;
        WP_PASSWORD: string;
    }
}
