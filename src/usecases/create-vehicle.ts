import { Vehicle } from "../entities/vehicle";
import { Either, failure, success } from "../errors/either";
import { VehicleRepository } from "../repositories/vehicle-repository";

export interface CreateVehicleRequest {
  model: string;
  plate: string;
  userId: string;
  active: boolean;
}

export type CreateVehicleResponse = Either<{ message: string }, { message: string }>;

interface CreateVehicleProtocol {
  execute(request: CreateVehicleRequest): Promise<CreateVehicleResponse>;
}

export class CreateVehicle implements CreateVehicleProtocol {
  constructor(private repository: VehicleRepository) {}

  async execute(request: CreateVehicleRequest): Promise<CreateVehicleResponse> {
    if (await this.repository.findVehiclePerPlate(request.plate))
      return failure({ message: "Essa placa já está registrada"});

    const vehicle = Vehicle.createVehicle(request.plate, request.userId, request.active, request.model);
    if (vehicle.isRight()) {
      this.repository.store(vehicle.value);
      return success({ message: "Veículo criado com sucesso" });
    } else {
      return failure(vehicle.reason);
    }
  }
}
