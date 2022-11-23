import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { withResult } from "@utils";

export const cache = (action: "getAll" | "delete" | "getById" | "delById") => async (
    req: FastifyRequest<{ Params: { id?: string } }, Server, IncomingMessage>,
    _reply: FastifyReply<Server, IncomingMessage, ServerResponse>
) => {

    if (action === "getAll") {
        return withResult(req, [...req.cache.values()]);
    }

    if (action === "delete") {
        const originalSize = req.cache.size;
        req.cache.clear();
        return withResult(req, { deleted: originalSize });
    }

    if (action === "getById" && req.params.id) {
        return withResult(req, req.cache.get(req.params.id) || { message: "Nothing found" });
    }

    if (action === "delById" && req.params.id) {
        return withResult(req, { deleted: req.cache.delete(req.params.id) });
    }

    return withResult(req, { message: "No handlers for this action" });
};