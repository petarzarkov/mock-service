import { FastifySchema } from "fastify";

export const byIdSchema = (type: string, op: "Delete" | "Get"): FastifySchema & Record<string, unknown> => ({
    description: `${op} ${type} by id`,
    tags: [type],
    summary: `${op} ${type} by id`,
    params: {
        type: "object",
        additionalProperties: false,
        required: ["id"],
        properties: {
            id: { type: "string", format: "uuid" }
        }
    }
});