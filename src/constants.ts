import config from "config";

export const isProd = process.env.NODE_ENV === "production";

export const NODE_ENV: string = process.env.NODE_ENV as string || "development";
export const LOG_APP_NAME: string = process.env.LOG_APP_NAME as string || config.has("log.appName") ? config.get<string>("log.appName") : "";
export const APP_VERSION = process.env.npm_package_version || "unknown";
export const K8S_CONTAINER: boolean = process.env.K8S_CONTAINER === "true";
export const BRANCH: string | undefined = process.env.GIT_BRANCH || undefined;
export const COMMIT: string | undefined = process.env.GIT_COMMIT || undefined;

/**
 * @default 5055
 */
export const SERVICE_PORT = Number(process.env.SERVICE_PORT) || (config.has("servicePort") ? config.get<number>("servicePort") : 5055);

export const DOCS_PATH: string = process.env.DOCS_PATH || "docs";

/**
 * how long to keep each request log (in seconds)
 * @default 60
 */
export const CACHE_ITEM_ALIVE_TIME = Number(process.env.CACHE_ITEM_ALIVE_TIME) || 60;
/**
 * in what period to check if an item has expired (in seconds)
 * @default 15
 */
export const CACHE_ITEM_ALIVE_CHECK_PERIOD = Number(process.env.CACHE_ITEM_ALIVE_CHECK_PERIOD) || 15;

/**
 * should this service cache the request logs
 * @default true
 */
export const USE_CACHE = process.env.USE_CACHE === "true" || true;