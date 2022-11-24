import { FastifyReply, FastifyRequest } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { constructLogId, withResult } from "@utils";

export const cache = (action: "getAll" | "delete" | "getById" | "delById") => async (
    req: FastifyRequest<{ Params: { id?: string }; Querystring: { searchPath?: string } }, Server, IncomingMessage>,
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

    if (action === "getById" && req.params.id && req.query.searchPath) {
        const logId = constructLogId(req.params.id, req.query.searchPath);
        return req.cache.get(logId) || { message: "Nothing found" };
    }

    if (action === "delById" && req.params.id && req.query.searchPath) {
        const logId = constructLogId(req.params.id, req.query.searchPath);
        return { deleted: req.cache.delete(logId) };
    }

    return withResult(req, { message: "No handlers for this action" });
};