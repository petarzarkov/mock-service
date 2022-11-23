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

export const SOCKER_SERVER_URL: string = process.env.SOCKER_SERVER_URL || "http://localhost:3010";
export const SOCKET_PATH: string = process.env.SOCKET_PATH || "";

export const HTTP2_ENABLED: boolean = process.env.HTTP2_ENABLED === "true" || false;