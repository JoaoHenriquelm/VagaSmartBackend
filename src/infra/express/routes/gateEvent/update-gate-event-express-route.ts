import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { UpdateGateEvent, UpdateGateEventRequest, UpdateGateEventResponse } from "../../../../usecases/update-gateEvent";

export type UpdateGateEventResponseHandler = {
    message: string, success: boolean
} | {
    message: string, success: boolean
}

export type UpdateGateEventRequestHandler = UpdateGateEventRequest;

export class UpdateGateEventRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateGateEventService: UpdateGateEvent
    ) {}

    static update(updateWalletService: UpdateGateEvent) {
        return new UpdateGateEventRoute(
            "/gateEvent",
            HttpMethod.PUT,
            updateWalletService
        );
    }
    getPath(): string {
        return this.path;
    }
    getMethod(): HttpMethod {
        return this.method;
    }

    getHandler(): (request: Request, response: Response) => Promise<void> {
        return async (request: Request, response: Response) => {
            const {
                active,
                authorized,
                id,
                reason
            }: UpdateGateEventRequestHandler = request.body;

            const input: UpdateGateEventRequestHandler = {
                active,
                authorized,
                id,
                operatorId: request.body.user.id,
                reason
            };

            const output = await this.updateGateEventService.execute(input)
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
        };
    }

    private present(
        input: UpdateGateEventResponse
    ): UpdateGateEventResponseHandler {
        if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
    }
}