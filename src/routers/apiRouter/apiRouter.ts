import { any, cache, stub } from "@handlers";
import { byIdSchema } from "@swagger";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const apiRouter = (app: FastifyInstance, _options: FastifyPluginOptions, next: (err?: Error | undefined) => void) => {

    app.get("/log", { schema: { tags: ["log"] } }, cache("getAll"));
    app.get("/log/:id", { schema: byIdSchema("log", "Get") }, cache("getById"));
    app.delete("/log", { schema: { tags: ["log"] } }, cache("delete"));
    app.delete("/log/:id", { schema: byIdSchema("log", "Delete") }, cache("delById"));

    app.post("/stub", {
        schema: {
            description: "Create stub/s",
            tags: ["stub"],
            summary: "Create stub/s",
            body: {
                type: "array",
                items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["match"],
                    properties: {
                        match: {
                            oneOf: [{ type: "array", items: { type: "string" }, default: ["/multi", "/paths"] }, { type: "string", default: "/single/path" }]
                        },
                        httpStatus: { type: "number", minimum: 200, maximum: 599, default: 200 },
                        httpHeaders: { type: "object" },
                        httpBody: {
                            oneOf: [{ type: "object" }, { type: "string" }]
                        },
                        delay: { type: "number", default: 0 },
                    }

                }
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
            },
            body: {
                type: "object",
                additionalProperties: false,
            }
        }
    }, any);

    next();
};

