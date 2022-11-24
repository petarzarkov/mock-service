import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Stub, LogId } from "@contracts";

// Declaration merging
declare module "fastify" {
    export interface FastifyInstance {
        cache: Map<LogId, Record<string, unknown>>;
        stubs: Map<string, Stub>;
    }
    export interface FastifyRequest {
        cache: Map<LogId, Record<string, unknown>>;
        stubs: Map<string, Stub>;
    }
}

const addCache: FastifyPluginAsync<{ cache: Map<LogId, Record<string, unknown>>; stubs: Map<string, Stub> }> = async (
    fastify,
    options
// eslint-disable-next-line @typescript-eslint/require-await
) => {
    fastify.decorate("cache", options.cache);
    fastify.decorate("stubs", options.cache);

    fastify.addHook("onRequest", (request, _reply, next) => {
        request.cache = options.cache;
        request.stubs = options.stubs;

        next();
    });
};

export const addCachePlugin = fp(addCache);