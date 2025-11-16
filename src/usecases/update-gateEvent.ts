import { GateEvent } from "../entities/gateEvent";
import { Either, failure, success } from "../errors/either";
import { GateEventRepository } from "../repositories/gateEvent-repository";


export type UpdateGateEventsRequest = GateEvent

export type UpdateGateEventsResponse = Either<
  { message: string; success: boolean },
  {
    message: string;
    success: boolean;
  }
>;

export interface UpdateGateEventsProtocol {
  execute(
    request: UpdateGateEventsRequest
  ): Promise<UpdateGateEventsResponse>;
}

export class UpdateGateEvents
  implements UpdateGateEventsProtocol
{
  constructor(
    private repositoryGateEvent: GateEventRepository
  ) {}

  async execute(
    request: UpdateGateEventsRequest
  ): Promise<UpdateGateEventsResponse> {
    await this.repositoryGateEvent.update(request)

    if(!request.operatorId || !request.reason || !request.authorized) {
      return failure({message: "O evento não foi atualizado", success: false})
    }
    return success({message: "O evento foi atualizado", success: true});
  }
}
