import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { withResult } from "@utils";
import { Stub } from "@contracts";

export const stub = (action: "create" | "getAll" | "delete") => async (
    req: FastifyRequest<{ Params: { id?: string }; Body: Stub[] }, Server, IncomingMessage>,
    _reply: FastifyReply<Server, IncomingMessage, ServerResponse>
) => {

    if (action === "create") {
        const stubs = req.body;
        for (const stub of stubs) {
            const matches = (Array.isArray(stub.match) ? stub.match : [stub.match]).map(item => item?.[0] !== "/" ? `/${item}` : item);
            for (const stubMatch of matches) {
                req.stubs.set(stubMatch, stub);
            }
        }

        return withResult(req, { created: stubs.length });
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