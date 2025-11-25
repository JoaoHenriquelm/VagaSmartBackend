import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { Vehicle } from "../../../../entities/vehicle";
import { IndexVehicles, IndexVehiclesResponse } from "../../../../usecases/index-vehicles";

export type IndexVehiclesResponseHandler =
	| {
			message: string;
			value: [];
	  }
	| {
			vehicles: Vehicle[];
	  };

export type IndexVehiclesRequestHandler = {
	idUser: string;
};

export class IndexVehiclesRoute implements Route {
	private constructor(
		private readonly path: string,
		private readonly method: HttpMethod,
		private readonly indexVehiclesService: IndexVehicles
	) {}

	static index(indexVehiclesService: IndexVehicles) {
		return new IndexVehiclesRoute("/vehicle", HttpMethod.GET, indexVehiclesService);
	}
	getPath(): string {
		return this.path;
	}
	getMethod(): HttpMethod {
		return this.method;
	}

	getHandler(): (request: Request, response: Response) => Promise<void> {
		return async (request: Request, response: Response) => {
            const { id } = request.body.user
			const output = await this.indexVehiclesService.execute({userId: id});

			const responseBody = this.present(output);

			response.status(output.isRight() ? 200 : 400).send(responseBody);
		};
	}

	private present(input: IndexVehiclesResponse): IndexVehiclesResponseHandler {
		if (input.isRight()) {
			return input.value;
		} else {
			return input.reason;
		}
	}
}
