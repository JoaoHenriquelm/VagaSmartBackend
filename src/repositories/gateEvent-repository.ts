import { GateEvent } from "../entities/gateEvent";
import { UpdateGateEventRequest } from "../usecases/update-gateEvent";

export interface GateEventRepository {
  store(gateEvent: GateEvent): Promise<void>;
  findGateEventsPerUserId(userId: string): Promise<Array<GateEvent>>;
  findGateEventsUnathorized(): Promise<Array<GateEvent>>
  update(gateEvent: UpdateGateEventRequest): Promise<void>
}
