import { Request, Response } from "express";
import { HttpMethod, Route } from "../route";
import { IndexUnathorizedGateEvents, IndexUnathorizedGateEventsResponse } from "../../../../usecases/index-unathorized-gateEvent";
import { GateEvent } from "../../../../entities/gateEvent";
import { Vehicle } from "../../../../entities/vehicle";
import { User } from "../../../../entities/user";

export type IndexUnathorizedGateEventsResponseHandler = {
    message: string
} |   {
    gateEventInfo: Array<{
      gateEvent: GateEvent;
      vehicle: Vehicle;
      user: User;
    }>;
  }

export type IndexUnathorizedGateEventsRequestHandler = {
    idUser: string
}

export class IndexUnathorizedGateEventsRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly indexUnathorizedGateEventsService: IndexUnathorizedGateEvents
    ) {}

    static index(indexUnathorizedGateEventsService:IndexUnathorizedGateEvents) {
        return new IndexUnathorizedGateEventsRoute(
            "/gateEvent/Unathorized",
            HttpMethod.GET,
            indexUnathorizedGateEventsService
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
            const output = await this.indexUnathorizedGateEventsService.execute()
            
            const responseBody = this.present(output)
            
            response.status(output.isRight()? 200 : 400).send(responseBody)
        };
    }

    private present(
        input: IndexUnathorizedGateEventsResponse
    ): IndexUnathorizedGateEventsResponseHandler {
        if(input.isRight()) {
            return input.value
        } else {
            return input.reason
        }
    }
}