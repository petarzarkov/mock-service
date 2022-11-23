import { any, cache, stub } from "@handlers";
import { byIdSchema } from "@swagger";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const apiRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

    app.get("/cache", { schema: { tags: ["cache"] } }, cache("getAll"));
    app.get("/cache/:id", { schema: byIdSchema("cache", "Get") }, cache("getById"));
    app.delete("/cache", { schema: { tags: ["cache"] } }, cache("delete"));
    app.delete("/cache/:id", { schema: byIdSchema("cache", "Delete") }, cache("delById"));

    app.post("/stub", {
        schema: {
            description: "Create stub/s",
            tags: ["stub"],
            summary: "Create stub/s",
            body: {
                type: "object",
                additionalProperties: false,
                required: ["match"],
                properties: {
                    match: {
                        oneOf: [{ type: "array", items: { type: "string" } }, { type: "string" }]
                    },
                    httpStatus: { type: "number" },
                    httpHeaders: { type: "object" },
                    httpBody: {
                        oneOf: [{ type: "object" }, { type: "string" }]
                    },
                },
                examples: [{
                    match: "/somePath"
                }, {
                    match: ["/multiple", "/paths"]
                }]
            }
        }
    }, stub("create"));
    app.get("/stub", { schema: { tags: ["stub"] } }, stub("getAll"));
    app.delete("/stub", { schema: { tags: ["stub"] } }, stub("delete"));

    app.get("/*", {
        schema: {
            params: {
                type: "object",
                additionalProperties: false,
                properties: {
                    wildcard: { type: "string" }
                }
            }
        }
    }, any);
    app.post("/*", {
        schema: {
            params: {
                type: "object",
                additionalProperties: false,
                properties: {
                    wildcard: { type: "string" }
                }
            }
        }
    }, any);

    next();
};

