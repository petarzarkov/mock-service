import { APP_VERSION, DOCS_PATH } from "@constants";
import { SwaggerOptions } from "@fastify/swagger";
import { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { generalError, generalResponse } from "./generalDefs";

export const swagUi: FastifySwaggerUiOptions = {
    routePrefix: DOCS_PATH,
    uiConfig: {
        docExpansion: "list",
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (_request, _reply, next) {
            next();
        },
        preHandler: function (_request, _reply, next) {
            next();
        }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
};

export const swagDocs: SwaggerOptions = {
    swagger: {
        schemes: ["http"],
        info: {
            title: "Mock Service API",
            description: "Mock Service API swagger",
            version: APP_VERSION,
        },
        externalDocs: {
            url: "https://bitbucket.sbtech.com/projects/CAS/repos/casino-mock-service/browse",
            description: "Find more info here"
        },
        consumes: ["application/json"],
        produces: ["application/json"],
        definitions: {
            "GeneralOKResponse": generalResponse,
            "GeneralErrorResponse": generalError
        },
    },
};