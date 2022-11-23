export const generalResponse = {
    type: "object",
    properties: {
        requestId: {
            type: "string",
            format: "uuid"
        },
        isSuccess: { type: "boolean", default: true },
        result: {
            type: "object",
            nullable: true,
        }
    }
};

export const generalError = {
    type: "object",
    properties: {
        requestId: {
            type: "string",
            format: "uuid"
        },
        isSuccess: { type: "boolean", default: false },
        error: {
            type: "string",
            nullable: true,
        }
    }
};

export const generalDefs = {
    200: {
        description: "Ok response",
        ...generalResponse
    },
    400: {
        description: "Bad request response",
        ...generalError
    },
    401: {
        description: "Unauthorized",
        ...generalError
    },
    404: {
        description: "Not found response",
        ...generalError
    },
    500: {
        description: "Server error response",
        ...generalError
    },
};
