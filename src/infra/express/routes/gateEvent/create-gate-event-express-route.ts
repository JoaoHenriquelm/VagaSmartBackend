import { NextFunction, Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateGateEvent, CreateGateEventRequest, CreateGateEventResponse } from "../../../../usecases/create-gate-event";
import { loginRequired } from "../../middlewares/loginRequired";

export type CreateGateEventResponseHandler = {
    message: string, success: boolean
} | {
    message: string, success: boolean
}

export type CreateGateEventRequestHandler = CreateGateEventRequest;

export class CreateGateEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createUserService: CreateGateEvent
    ) {}

    static create(createUserService: CreateGateEvent) {
        return new CreateGateEventRoute(
            "/gateEvent",
            HttpMethod.POST,
            createUserService
        );
    }
    getPath(): string {
        return this.path;
    }
    getMethod(): HttpMethod {
        return this.method;
    }

    getMiddlewares(): Array<(req: Request, res: Response, next: NextFunction) => void> {
        return [loginRequired];
    }

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            const { id } = request.body.user;
            const {
                idVehicle,
                type,
                authorized,
                operatorId,
                reason
            }: CreateGateEventRequestHandler = request.body;

            const input: CreateGateEventRequestHandler = {
                idUser: id,
                idVehicle,
                type,
                authorized,
                operatorId,
                reason
            };

            const output = await this.createUserService.execute(input)
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
        };
    }

    private present(
        input: CreateGateEventResponse
    ): CreateGateEventResponseHandler {
        if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
    }
}