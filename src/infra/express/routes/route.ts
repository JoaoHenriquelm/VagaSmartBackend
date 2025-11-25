import { NextFunction, Request, Response } from "express"

export type HttpMethod = 'get' | 'post' | 'put'

export const HttpMethod = {
    GET: 'get' as HttpMethod,
    POST: 'post' as HttpMethod,
    PUT: 'put' as HttpMethod,
} as const

export interface Route {
    getHandler(): (request: Request, response: Response) => Promise<void>
    // getMiddlewares(): ( req: Request, res: Response, next: NextFunction ) => Promise<void>
    getMiddlewares?(): Array<(req: Request, res: Response, next: NextFunction) => void>;
    getPath(): string
    getMethod(): HttpMethod
}