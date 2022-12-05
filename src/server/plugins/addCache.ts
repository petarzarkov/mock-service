import { Stub } from "@contracts";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import NodeCache from "node-cache";

// Declaration merging
declare module "fastify" {
    export interface FastifyInstance {
        cache: NodeCache;
        stubs: Map<string, Stub>;
    }
    export interface FastifyRequest {
        cache: NodeCache;
        stubs: Map<string, Stub>;
        // cache: Map<LogId, Record<string, unknown>>;
    }
}

const addCache: FastifyPluginAsync<{ cache: NodeCache; stubs: Map<string, Stub> }> = async (
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