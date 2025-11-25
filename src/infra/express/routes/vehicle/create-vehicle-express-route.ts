import { NextFunction, Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateVehicle, CreateVehicleRequest, CreateVehicleResponse } from "../../../../usecases/create-vehicle";
import { loginRequired } from "../../middlewares/loginRequired";

export type CreateVehicleResponseHandler = {
    message: string, success: boolean
} | {
    message: string, success: boolean
}

export type CreateVehicleRequestHandler = CreateVehicleRequest;

export class CreateVehicleRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createUserService: CreateVehicle
    ) {}

    static create(createUserService: CreateVehicle) {
        return new CreateVehicleRoute(
            "/vehicle",
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
                model,
                plate
            }: CreateVehicleRequestHandler = request.body;

            const input: CreateVehicleRequestHandler = {
                model,
                plate,
                userId: id
            };

            const output = await this.createUserService.execute(input)
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
        };
    }

    private present(
        input: CreateVehicleResponse
    ): CreateVehicleResponseHandler {
        if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
    }
}