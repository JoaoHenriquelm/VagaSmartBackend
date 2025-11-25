import { Vehicle } from "../entities/vehicle";

export interface VehicleRepository {
  store(vehicle: Vehicle): Promise<void>;
  findVehiclePerId(id: string): Promise<Vehicle | null>;
  findVehiclePerPlate(plate: string): Promise<Vehicle | null>;
  findVehiclesPerUserId(userId: string): Promise<Vehicle[] | null>;
}
