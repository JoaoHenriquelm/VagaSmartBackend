import { randomUUID } from "crypto";
import { Either, failure, success } from "../errors/either";

export interface VehicleProps {
  _id: string;
  plate: string;
  model: string
  userId: string;
  active: boolean;
}

type CreateVehicle = Either<{ message: string, success: boolean }, Vehicle>;

export class Vehicle {
  private constructor(private props: VehicleProps) {}

  static with(props: VehicleProps) {
    return new Vehicle(props);
  }

  static createVehicle(
    plate: string,
    userId: string,
    active: boolean,
    model: string
  ): CreateVehicle {
    if (!userId) {
      return failure({ message: "É obrigatório o veículo ter um usuário", success: false });
    }
    if (!plate || !active) {
      return failure({ message: "Preencha todos os campos obrigatórios", success: false });
    }
    return success(
      new Vehicle({
        _id: randomUUID().toString(),
        plate: plate,
        userId: userId,
        model: model,
        active: true,
      })
    );
  }

  get id(): string {
    return this.props._id;
  }

  get plate(): string {
    return this.props.plate;
  }

  get active(): boolean {
    return this.props.active;
  }

  get userId(): string {
    return this.props.userId;
  }
  
  get model(): string {
    return this.props.model
  }
}
