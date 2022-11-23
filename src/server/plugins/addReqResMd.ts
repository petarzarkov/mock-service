import { withError } from "../../utils/results";
import { FastifyPluginAsync, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { RouteGenericInterface } from "fastify/types/route";
import { IAppLogger } from "casino-logger";
import { Server, IncomingMessage } from "http";

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

const parseRequestLog = (request: FastifyRequest) => ({
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

    fastify.addHook("onRequest", (request, _reply, done) => {
        const reqIdHeader = request.headers?.["x-request-id"];
        if (reqIdHeader) {
            request.id = reqIdHeader;
        }

        request.logger = options.logger;
        fastify.logger.info(`Received ${request.method} request`, {
            requestId: request.id as string,
            eventName: buildEvent(request),
            request: parseRequestLog(request)
        });

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

    fastify.setErrorHandler((error, req, reply) => {
        if (error.validation?.length) {
            fastify.logger.error(`Validation error on ${req.method} request`, {
                err: error,
                requestId: req.id as string,
                eventName: buildEvent(req),
                request: parseRequestLog(req)
            });
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const msg = error.validation.map(err => `${err.keyword} ${(err as unknown as { dataPath: string })?.dataPath} ${err.message}`).join(", ");
            return reply.status(400).send(withError(msg));
        }

        return reply.send(withError(error));
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