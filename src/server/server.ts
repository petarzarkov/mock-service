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
import xml2js from "xml2js";

function tryParseBoolean (val: string) {
    if (/^(?:true|false)$/i.test(val)) {
        return val.toLowerCase() === "true";
    }

    return val;
}

function tryParseDatetime (val: string) {
    const res = new Date(Date.parse(val));
    if (!isNaN(res.getTime())) {
        return res;
    }

    return val;
}

function tryParseNumber (val: string) {
    const res = +val;
    if (!isNaN(res)) {
        return res;
    }

    return val;
}

export const startServer = async (logger: IAppLogger) => {
    const app = fastify({
        logger: false,
        requestIdLogLabel: "requestId",
        genReqId: () => v4()
    });

    const xmlParser = new xml2js.Parser({
        mergeAttrs: true,
        explicitArray: false,
        emptyTag: undefined,
        attrValueProcessors: [
            (value: string, name: string) => {
                switch (name) {
                    case "clienttypeid":
                    case "amount":
                    case "freegameoffercostperbet":
                        return tryParseNumber(value);
                    case "timestamp":
                        return tryParseDatetime(value);
                    case "start":
                    case "finish":
                    case "offline":
                        return tryParseBoolean(value);
                    default:
                        return value;
                }
            }
        ]
    });
    // Handle XML
    app.addContentTypeParser(["text/xml", "application/xml", "application/rss+xml"], function (_request, payload, done) {
        let body = "";

        payload.on("error", (err) => {
            done(err);
        });

        payload.on("data", (chunk: string) => {
            body += chunk;
        });

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        payload.on("end", async () => {
            try {
                const request = await xmlParser.parseStringPromise(body) as Record<string, unknown>;
                done(null, request);
            } catch (err) {
                done(err as Error);
            }
        });
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
