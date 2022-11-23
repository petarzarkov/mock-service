import { FastifyRequest } from "fastify";

export interface ISuccessResult<T> {
    requestId: string;
    isSuccess: true;
    result: T | undefined;
}

export interface IErrorResult {
    requestId: string;
    isSuccess: false;
    error: Error | unknown;
}

export const withResult = <T>(req: FastifyRequest, data: T | undefined): ISuccessResult<T> => ({ requestId: req.id as string, isSuccess: true, result: data });
export const withError = (req: FastifyRequest, error: Error | unknown): IErrorResult => ({ requestId: req.id as string, isSuccess: false, error });