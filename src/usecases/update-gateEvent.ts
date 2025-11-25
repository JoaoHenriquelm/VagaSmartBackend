import { Either, failure, success } from "../errors/either";
import { GateEventRepository } from "../repositories/gateEvent-repository";


export type UpdateGateEventRequest = {
  id: string
  operatorId: string;
  reason: string;
  authorized: boolean;
  active: boolean
}

export type UpdateGateEventResponse = Either<
  { message: string; success: boolean },
  {
    message: string;
    success: boolean;
  }
>;

export interface UpdateGateEventProtocol {
  execute(
    request: UpdateGateEventRequest
  ): Promise<UpdateGateEventResponse>;
}

export class UpdateGateEvent
  implements UpdateGateEventProtocol
{
  constructor(
    private repositoryGateEvent: GateEventRepository
  ) {}

  async execute(
    request: UpdateGateEventRequest
  ): Promise<UpdateGateEventResponse> {
    if(!request.operatorId || !request.reason || request.active === undefined || request.active === null) {
      return failure({message: "O evento não foi atualizado", success: false})
    }
    await this.repositoryGateEvent.update(request)
    return success({message: "O evento foi atualizado", success: true});
  }
}
