import { Vehicle } from "../entities/vehicle";
import { Either, failure, success } from "../errors/either";
import { VehicleRepository } from "../repositories/vehicle-repository";

export interface IndexVehiclesRequest {
  userId: string;
}

export type IndexVehiclesResponse = Either<
  { message: string, value: [] },
  {
    vehicles: Vehicle[]
  }
>;

interface IndexVehiclesProtocol {
  execute(
    request: IndexVehiclesRequest
  ): Promise<IndexVehiclesResponse>;
}

export class IndexVehicles
  implements IndexVehiclesProtocol
{
  constructor(
    private repositoryVehicle: VehicleRepository
  ) {}

  async execute(
    request: IndexVehiclesRequest
  ): Promise<IndexVehiclesResponse> {
    const searchVehicles = await this.repositoryVehicle.findVehiclesPerUserId(request.userId);

    if(!searchVehicles) {
      return failure({message: "Nenhum veículo encontrado para esse usuário", value: []});
    }

    return success({
      vehicles: searchVehicles
    });
  }
}
