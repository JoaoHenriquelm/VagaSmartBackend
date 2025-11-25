import { Vehicle } from "../../entities/vehicle";
import { prisma } from "../../services/prisma";
import { VehicleRepository } from "../vehicle-repository";

export class SqliteVehicle implements VehicleRepository {
    async findVehiclePerId(id: string): Promise<Vehicle | null> {
        const searchVehicle = await prisma.vehicle.findUnique({
            where: {
                id: id,
            },
        });
        if (!searchVehicle) {
            return null;
        }
        const vehicleEntity = Vehicle.with({
            _id: searchVehicle.id,
            plate: searchVehicle.plate,
            userId: searchVehicle.userId,
            model: searchVehicle.model,
        });
        return vehicleEntity;
        
    }
    
    async findVehiclePerPlate(plate: string): Promise<Vehicle | null> {
        const searchVehicle = await prisma.vehicle.findUnique({
            where: {
                plate: plate,
            },
        });
        if (!searchVehicle) {
            return null;
        }
        const vehicleEntity = Vehicle.with({
            _id: searchVehicle.id,
            plate: searchVehicle.plate,
            userId: searchVehicle.userId,
            model: searchVehicle.model,
        });
        return vehicleEntity;
        
    }

    async store(vehicle: Vehicle): Promise<void> {
        await prisma.vehicle.create({
            data: {
                id: vehicle.id,
                plate: vehicle.plate,
                userId: vehicle.userId,
                model: vehicle.model,
            },
        });
    }

    async findVehiclesPerUserId(userId: string): Promise<Vehicle[] | null> {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                userId: userId,
            },
        });
    
        if (vehicles.length === 0) {
            return null;
        }
    
        return vehicles.map(vehicle => Vehicle.with({
            _id: vehicle.id,
            plate: vehicle.plate,
            userId: vehicle.userId,
            model: vehicle.model,
        }));
    }
}
