import { fastify } from "fastify";
import fcors from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { swagDocs, swagUi } from "@swagger";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { IAppLogger } from "casino-logger";
import { apiRouter } from "@routers";
import { addCachePlugin, addReqResMd } from "./plugins";
import { CACHE_ITEM_ALIVE_CHECK_PERIOD, CACHE_ITEM_ALIVE_TIME, DOCS_PATH, isProd, SERVICE_PORT } from "@constants";
import { v4 } from "uuid";
import NodeCache from "node-cache";

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

    await app.register(fcors);
    await app.register(fastifySwagger, swagDocs);
    await app.register(fastifySwaggerUi, swagUi);
    await app.register(addCachePlugin, {
        cache: new NodeCache({
            stdTTL: CACHE_ITEM_ALIVE_TIME,
            checkperiod: CACHE_ITEM_ALIVE_CHECK_PERIOD,
        }),
        stubs: new Map()
    });
    await app.register(addReqResMd, { logger });
    await app.register(apiRouter);

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
            app.logger.info(`Service started ${isProd ? address : `http://localhost:${SERVICE_PORT}/${DOCS_PATH}`}`, { port: SERVICE_PORT });
        });
    } catch (err) {
        app.logger.error("Error starting server", { err: <Error>err, port: SERVICE_PORT });
        process.exit(1);
    }

    return app;
};
