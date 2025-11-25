import { NextFunction, Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import {
	ShowUserAndWalletAndGateEvents,
	ShowUserAndWalletAndGateEventsResponse
} from "../../../../usecases/show-user-and-wallet-and-gate-event";
import { User } from "../../../../entities/user";
import { Wallet } from "../../../../entities/wallet";
import { GateEvent } from "../../../../entities/gateEvent";
import { Vehicle } from "../../../../entities/vehicle";
import { loginRequired } from "../../middlewares/loginRequired";

export type ShowDashboardResponseHandler =
	| {
			message: string;
	  }
	| {
			user: User;
			wallet: Wallet;
			gateEvent: Array<{
				gateEvent: GateEvent;
				vehicle: Vehicle;
			}>;
	  };

export type ShowDashboardRequestHandler = {
	idUser: string;
};

export class ShowDashboardRoute implements Route {
	private constructor(
		private readonly path: string,
		private readonly method: HttpMethod,
		private readonly showDashboardService: ShowUserAndWalletAndGateEvents
	) {}

	static show(showDashboardService: ShowUserAndWalletAndGateEvents) {
		return new ShowDashboardRoute("/dashboard", HttpMethod.GET, showDashboardService);
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
			const output = await this.showDashboardService.execute({ userId: id });

			const responseBody = this.present(output);
			
			response.status(output.isRight() ? 200 : 400).send(responseBody);
		};
	}

	private present(input: ShowUserAndWalletAndGateEventsResponse): ShowDashboardResponseHandler {
		if (input.isRight()) {
			return input.value;
		} else {
			return input.reason;
		}
	}
}
