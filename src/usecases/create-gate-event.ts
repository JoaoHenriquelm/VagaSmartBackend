import { Either, failure, success } from "../errors/either";
import { GateEventRepository } from "../repositories/gateEvent-repository";
import { GateEvent } from "../entities/gateEvent";

export interface CreateGateEventRequest {
  idUser: string
  idVehicle: string
  type: "AUTO" | "MANUAL";
  authorized?: boolean
  operatorId?: string;
  reason?: string;
}

export type CreateGateEventResponse = Either<
  { message: string, success: boolean },
  { message: string, success: boolean }
>;

interface CreateGateEventProtocol {
  execute(
    request: CreateGateEventRequest
  ): Promise<CreateGateEventResponse>;
}

export class CreateGateEvent implements CreateGateEventProtocol {
  constructor(
    private repository: GateEventRepository,
  ) {}

  async execute(
    request: CreateGateEventRequest
  ): Promise<CreateGateEventResponse> {
    const gateEvent = GateEvent.createGateEvent(request.type, request.idUser, request.idVehicle, request.authorized, request.operatorId, request.reason)
    if(gateEvent.isRight()) {
      await this.repository.store(gateEvent.value)
    }

    if(gateEvent.isRight()) {
      return success({message: "Evento de cancela criado com sucesso", success: true})
    } else {
      return failure(gateEvent.reason)
    }
  }
}
