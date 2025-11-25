import { randomUUID } from "crypto";
import { Either, failure, success } from "../errors/either";

export interface GateEventProps {
  _id: string;
  userId: string;
  vehicleId: string;
  type: "AUTO" | "MANUAL";
  timestamp: number;
  authorized?: boolean;
  operatorId?: string;
  reason?: string;
  active: boolean
}

type CreateGateEvent = Either<{ message: string; success: boolean }, GateEvent>;

export class GateEvent {
  private constructor(private props: GateEventProps) {}

  static with(props: GateEventProps) {
    return new GateEvent(props);
  }

  static createGateEvent(
    type: "AUTO" | "MANUAL",
    userId: string,
    vehicleId: string,
    authorized?: boolean,
    operatorId?: string,
    reason?: string
  ): CreateGateEvent {

    return success(
      new GateEvent({
        _id: randomUUID().toString(),
        type: type,
        operatorId: operatorId,
        reason: reason,
        vehicleId: vehicleId,
        userId: userId,
        authorized: type === "AUTO" ? true : authorized,
        timestamp: Date.now(),
        active: true
      })
    );
  }

  get id(): string {
    return this.props._id;
  }

  get type(): string {
    return this.props.type;
  }

  get operatorId(): string | undefined {
    return this.props.operatorId;
  }

  get reason(): string | undefined {
    return this.props.reason;
  }

  get vehicleId(): string {
    return this.props.vehicleId;
  }

  get userId(): string {
    return this.props.userId;
  }
  
  get authorized(): boolean | undefined {
    return this.props.authorized
  }

  get active(): boolean {
    return this.props.active
  }

  set authorized(authorized: boolean) {
    this.authorized = authorized
  }

  set operatorId(operatorId: string) {
    this.operatorId = operatorId
  }
  
  set reason(reason: string) {
    this.reason = reason
  }
}
