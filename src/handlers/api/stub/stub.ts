import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { withResult } from "@utils";
import { Stub } from "@contracts";

export const stub = (action: "create" | "getAll" | "delete") => async (
    req: FastifyRequest<{ Params: { id?: string }; Body: Stub }, Server, IncomingMessage>,
    _reply: FastifyReply<Server, IncomingMessage, ServerResponse>
) => {

    if (action === "create") {
        const stub = req.body;
        const matches = Array.isArray(stub.match) ? stub.match : [stub.match];
        for (const stubMatch of matches) {
            req.stubs.set(stubMatch, stub);
        }

        return withResult(req, { created: matches, stub });
    }

    if (action === "getAll") {
        return withResult(req, [...req.stubs.values()]);
    }

    if (action === "delete") {
        const stubKeys = [...req.stubs.keys()];
        req.stubs.clear();
        return withResult(req, { deleted: stubKeys });
    }

    return withResult(req, { message: "No handlers for this action" });
};