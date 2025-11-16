import { GateEvent } from "../entities/gateEvent";
import { User } from "../entities/user";
import { Vehicle } from "../entities/vehicle";
import { Wallet } from "../entities/wallet";
import { Either, failure, success } from "../errors/either";
import { GateEventRepository } from "../repositories/gateEvent-repository";
import { UserRepository } from "../repositories/user-repository";
import { VehicleRepository } from "../repositories/vehicle-repository";
import { WalletRepository } from "../repositories/wallet-repository";

export interface ShowUserAndWalletAndGateEventsRequest {
  userId: string;
}

export type ShowUserAndWalletAndGateEventsResponse = Either<
  { message: string },
  {
    user: User;
    wallet: Wallet;
    gateEvent: Array<{
      gateEvent: GateEvent;
      vehicle: Vehicle;
  }>;
  }
>;

interface ShowUserAndWalletAndGateEventsProtocol {
  execute(
    request: ShowUserAndWalletAndGateEventsRequest
  ): Promise<ShowUserAndWalletAndGateEventsResponse>;
}

export class ShowUserAndWalletAndGateEvents
  implements ShowUserAndWalletAndGateEventsProtocol
{
  constructor(
    private repositoryUser: UserRepository,
    private repositoryWallet: WalletRepository,
    private repositoryGateEvent: GateEventRepository,
    private repositoryVehicle: VehicleRepository
  ) {}

  async execute(
    request: ShowUserAndWalletAndGateEventsRequest
  ): Promise<ShowUserAndWalletAndGateEventsResponse> {
    const searchUser = await this.repositoryUser.findUserPerId(request.userId);
    if (!searchUser)
      return failure({ message: "Não existe usuário com esse ID" });
    const searchWallet = await this.repositoryWallet.findWalletPerUserId(
      request.userId
    );
    if (!searchWallet)
      return failure({ message: "Não existe carteira com esse ID" });
    const searchGateEvent =
      await this.repositoryGateEvent.findGateEventsPerUserId(searchUser.id);

    const authorizedGateEvents = searchGateEvent.filter(e => e.authorized);

    const gateEventInfo = await Promise.all(
      authorizedGateEvents.map(async (gateEvent) => {
        const vehicle = await this.repositoryVehicle.findVehiclePerId(
          gateEvent.vehicleId
        ) as Vehicle;
        return {
          gateEvent: gateEvent,
          vehicle
        }
      })
    );

    return success({
      user: searchUser,
      wallet: searchWallet,
      gateEvent: gateEventInfo,
    });
  }
}
