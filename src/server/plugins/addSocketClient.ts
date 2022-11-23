import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { SocketClient } from "../../socket/socketClient";

// Declaration merging
declare module "fastify" {
    export interface FastifyInstance {
        socketClients: SocketClient[];
    }
    export interface FastifyRequest {
        socketClients: SocketClient[];
    }
}

const addSocketClients: FastifyPluginAsync<{ socketClients: SocketClient[] }> = async (
    fastify,
    options
// eslint-disable-next-line @typescript-eslint/require-await
) => {
    fastify.decorate("socketClients", options.socketClients);

    fastify.addHook("preHandler", (request, _reply, next) => {
        request.socketClients = options.socketClients;

        next();
    });
};

export const addSocketClientPlugin = fp(addSocketClients);