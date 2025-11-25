import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { CreateUserAndWallet, CreateUserAndWalletRequest, CreateUserAndWalletResponse } from "../../../../usecases/create-user-and-wallet";

export type CreateUserResponseHandler = {
    message: string, success: boolean
} | {
    message: string, success: boolean
}

export type CreateUserRequestHandler = CreateUserAndWalletRequest;

export class CreateUserRoute implements Route {
	private constructor(
		private readonly path: string,
		private readonly method: HttpMethod,
		private readonly createUserService: CreateUserAndWallet
	) {}

	static create(createUserService: CreateUserAndWallet) {
		return new CreateUserRoute(
			"/register",
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

	getHandler(): (request: Request, response: Response) => Promise<void> {
		return async (request: Request, response: Response) => {
			const {
				email,
                name,
                password,
                type
			}: CreateUserRequestHandler = request.body;


			const input: CreateUserRequestHandler = {
                email: email,
                name: name,
                password: password,
                type: type.toUpperCase() as "FUNCIONARIO" | "ALUNO" | "VISITANTE" | "OPERADOR"
			};

            const output = await this.createUserService.execute(input)
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
		};
	}

	private present(
		input: CreateUserAndWalletResponse
	): CreateUserResponseHandler {
		if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
	}
}