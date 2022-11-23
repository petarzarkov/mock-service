import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { delay, withResult } from "@utils";

export const any = async (
    req: FastifyRequest<{ Querystring: { ws?: boolean; delay?: number } }, Server, IncomingMessage>,
    reply: FastifyReply<Server, IncomingMessage, ServerResponse>
) => {

    if (req.stubs.has(req.url)) {
        const stubResult = req.stubs.get(req.url);
        const headers = {
            ["x-request-id"]: req.id as string,
            ...stubResult?.httpHeaders,
        };

        if (stubResult?.delay) {
            await delay(stubResult.delay);
        }

        return reply
            .status(stubResult?.httpStatus || 200)
            .headers(headers)
            .send(stubResult?.httpBody || {});
    }

    return withResult(req, {
        message: `No stub handler found for ${req.url}`,
        elapsed: reply.getResponseTime()
    });
};