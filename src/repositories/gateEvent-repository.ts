import { GateEvent } from "../entities/gateEvent";

export interface GateEventRepository {
  store(gateEvent: GateEvent): Promise<void>;
  findGateEventsPerUserId(userId: string): Promise<Array<GateEvent>>;
  findGateEventsUnathorized(): Promise<Array<GateEvent>>
  update(gateEvent: GateEvent): Promise<void>
}
