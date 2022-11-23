/* eslint-disable @typescript-eslint/no-floating-promises */
import { fastify } from "fastify";
import fcors from "@fastify/cors";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { IAppLogger } from "casino-logger";
import { apiRouter } from "@routers";
import { addReqResMd } from "./plugins";
import { isProd, SERVICE_PORT } from "@constants";
import { v4 } from "uuid";

export const startServer = async (logger: IAppLogger) => {
    const app = fastify({
        logger: false,
        requestIdLogLabel: "requestId",
        genReqId: () => v4()
    });

    app.setValidatorCompiler(({ schema, httpPart }) => {
        const defaultSchema = new Ajv({
            removeAdditional: true,
            useDefaults: true,
            coerceTypes: false
        });
        const querySchema = new Ajv({
            removeAdditional: true,
            useDefaults: true,
            coerceTypes: true
        });

        addFormats(defaultSchema);
        addFormats(querySchema);
        return httpPart === "querystring" ? querySchema.compile(schema) : defaultSchema.compile(schema);
    });

    app.register(fcors);
    app.register(addReqResMd, { logger });
    // if (!HTTP2_ENABLED) {
    //     app.register(addSocketClientPlugin, { socketClients: hubs.map(hub => new SocketClient(hub)) });
    // }
    app.register(apiRouter);

    app.ready(err => {
        if (err) {
            app.logger.error("Error on app ready", { err });
        }
    });

    try {
        app.listen({
            port: SERVICE_PORT,
            host: "0.0.0.0"
        }, (_, address) => {
            app.logger.info(`Service started ${isProd ? address : `http://localhost:${SERVICE_PORT}`}`, { port: SERVICE_PORT });
        });
    } catch (err) {
        app.logger.error("Error starting server", { err: <Error>err, port: SERVICE_PORT });
        process.exit(1);
    }

    return app;
};
