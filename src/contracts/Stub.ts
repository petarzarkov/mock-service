export type Stub = {
    match: string | string[];
    httpStatus?: number;
    httpHeaders?: Record<string, string>;
    httpBody?: Record<string, unknown> | string;
};