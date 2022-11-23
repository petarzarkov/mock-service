import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { withResult } from "@utils";

export const any = async (
    req: FastifyRequest<{ Querystring: { ws?: boolean; delay?: number } }, Server, IncomingMessage>,
    reply: FastifyReply<Server, IncomingMessage, ServerResponse>
) => {

    return withResult({
        requestId: req.id as string,
        elapsed: reply.getResponseTime()
    });
};