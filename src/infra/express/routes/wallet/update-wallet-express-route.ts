import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { UpdateWallet, UpdateWalletRequest, UpdateWalletResponse } from "../../../../usecases/update-wallet";

export type UpdateWalletResponseHandler = {
    message: string, success: boolean
} | {
    message: string, success: boolean
}

export type UpdateWalletRequestHandler = UpdateWalletRequest;

export class UpdateWalletRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateWalletService: UpdateWallet
    ) {}

    static update(updateWalletService: UpdateWallet) {
        return new UpdateWalletRoute(
            "/wallet",
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
                type,
                value
            }: UpdateWalletRequestHandler = request.body;

            const input: UpdateWalletRequestHandler = {
                type,
                value,
                userId: request.body.user.id
            };

            const output = await this.updateWalletService.execute(input)
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
        };
    }

    private present(
        input: UpdateWalletResponse
    ): UpdateWalletResponseHandler {
        if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
    }
}