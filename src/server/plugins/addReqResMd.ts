import { withError } from "../../utils/results";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { RouteGenericInterface } from "fastify/types/route";
import { cleanUpNullables, IAppLogger } from "casino-logger";
import { Server, IncomingMessage } from "http";
import { constructLogId } from "@utils";

// More info on fastify request lifecycle: https://www.fastify.io/docs/latest/Reference/Lifecycle/

// Declaration merging
declare module "fastify" {
    export interface FastifyInstance {
        logger: IAppLogger;
    }
    export interface FastifyRequest {
        logger: IAppLogger;
    }
}

const parseRequestLog = (request: FastifyRequest) => cleanUpNullables({
    requestId: request.id as string,
    method: request.method,
    url: request.url,
    path: request.routerPath,
    parameters: request.params,
    body: request.body,
    query: request.query,
    headers: request.headers
});

const buildEvent = (
    request: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>
) => {
    const url = request.url?.split("?")?.[0];
    return url;
};

const ReqResMd: FastifyPluginAsync<{ logger: IAppLogger }> = async (
    fastify,
    options
// eslint-disable-next-line @typescript-eslint/require-await
) => {
    fastify.decorate("logger", options.logger);

    // doing this in preValidation as the body is parsed here and not in onRequest hook
    fastify.addHook("preValidation", (request: FastifyRequest<{ Body: { requestId?: string } }>, _reply, done) => {
        const reqId = request.headers?.["x-request-id"] as string || request.body?.requestId;
        if (reqId) {
            request.id = reqId;
        }

        // Deep copy
        const parsedRequest = JSON.parse(JSON.stringify(parseRequestLog(request))) as ReturnType<typeof parseRequestLog>;
        const event = buildEvent(request);
        request.logger = options.logger;
        fastify.logger.info(`Received ${request.method} request`, {
            requestId: request.id as string,
            eventName: event,
            request: parsedRequest
        });

        if (request.stubs.has(request.url)) {
            const logId = constructLogId(request.id as string, request.url);
            request.cache.set(logId, {
                logId,
                request: parsedRequest
            });
        }

        done();
    });

    fastify.addHook("onResponse", (request, reply, done) => {
        fastify.logger.info(`Sent ${request.method} response`, {
            requestId: request.id as string,
            eventName: buildEvent(request),
            responseTime: reply.getResponseTime(),
            request: parseRequestLog(request),
            response: {
                statusCode: reply.statusCode,
                statusMessage: reply.raw.statusMessage,
                sent: reply.sent,
                headers: reply.getHeaders()
            }
        });

        done();
    });

    fastify.addHook("onSend", (request, reply, payload, done) => {
        if (request.stubs.has(request.url)) {
            let parsedPayload = payload;
            try {
                parsedPayload = JSON.parse(payload as string);
            } catch (error) {
                // empty
            }
            const logId = constructLogId(request.id as string, request.url);
            request.cache.set(logId, {
                ...request.cache.get(logId),
                response: {
                    body: parsedPayload,
                    headers: reply.getHeaders(),
                    responseTime: reply.getResponseTime(),
                    statusCode: reply.statusCode
                },
            });
        }

        done();
    });

    fastify.setErrorHandler((error, req, reply) => {
        if (error.validation?.length) {
            fastify.logger.error(`Validation error on ${req.method} request`, {
                err: error,
                requestId: req.id as string,
                eventName: buildEvent(req),
                request: parseRequestLog(req)
            });

            return reply.status(400).send(withError(req, error.message));
        }

        return reply.send(withError(req, error));
    });

    fastify.addHook("onError", (request, reply, error, done) => {
        fastify.logger.error(`Error on ${request.method} request`, {
            err: error,
            requestId: request.id as string,
            eventName: buildEvent(request),
            responseTime: reply.getResponseTime(),
            request: parseRequestLog(request)
        });

        done();
    });

};

export const addReqResMd = fp(ReqResMd);