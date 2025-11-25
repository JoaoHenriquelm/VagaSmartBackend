import { GateEvent } from "../entities/gateEvent";
import { User } from "../entities/user";
import { Vehicle } from "../entities/vehicle";
import { Either, success } from "../errors/either";
import { GateEventRepository } from "../repositories/gateEvent-repository";
import { UserRepository } from "../repositories/user-repository";
import { VehicleRepository } from "../repositories/vehicle-repository";

export type IndexUnathorizedGateEventsResponse = Either<
  { message: string },
  {
    gateEventInfo: Array<{
      gateEvent: GateEvent;
      vehicle: Vehicle;
      user: User;
    }>;
  }
>;

interface IndexUnathorizedGateEventsProtocol {
  execute(): Promise<IndexUnathorizedGateEventsResponse>;
}

export class IndexUnathorizedGateEvents
  implements IndexUnathorizedGateEventsProtocol
{
  constructor(
    private repositoryUser: UserRepository,
    private repositoryGateEvent: GateEventRepository,
    private repositoryVehicle: VehicleRepository
  ) {}

  async execute(): Promise<IndexUnathorizedGateEventsResponse> {
    const searchGateEvents =
      await this.repositoryGateEvent.findGateEventsUnathorized();

    const gateEventInfo = await Promise.all(
      searchGateEvents.map(async (gateEvent) => {
        const vehicle = await this.repositoryVehicle.findVehiclePerId(
          gateEvent.vehicleId
        ) as Vehicle;

        const user = await this.repositoryUser.findUserPerId(gateEvent.userId) as User;
        
        return {
          gateEvent: gateEvent,
          user,
          vehicle,
        };
      })
    );
    return success({gateEventInfo})
  }
}
