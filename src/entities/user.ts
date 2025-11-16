import { randomUUID } from "crypto";
import { Either, failure, success } from "../errors/either";

export interface UserProps {
  _id: string;
  name: string;
  email: string;
  type: "FUNCIONARIO" | "ALUNO" | "VISITANTE";
  hashPassword: string;
  active: boolean;
}

type CreateUser = Either<{ message: string, success: boolean }, User>;

export class User {
  private constructor(private props: UserProps) {}

  static with(props: UserProps) {
    return new User(props);
  }

  static createUser(
    name: string,
    email: string,
    type: "FUNCIONARIO" | "ALUNO" | "VISITANTE",
    hashPassword: string,
  ): CreateUser {
    if (!name || !email || !type || !hashPassword) {
      return failure({ message: "Preencha todos os campos obrigatórios", success: false });
    }

    if(type !== "FUNCIONARIO" || "ALUNO" || "VISITANTE") {
        return failure({ message: "O tipo de usuário não pode ser diferentes de FUNCIONARIO, ALUNO OU VISITANTE", success: false });
    }

    return success(
      new User({
        _id: randomUUID().toString(),
        email: email,
        hashPassword: hashPassword,
        name: name,
        type: type,
        active: true,
      })
    );
  }

  get id(): string {
    return this.props._id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get type(): "FUNCIONARIO" | "ALUNO" | "VISITANTE" {
    return this.props.type;
  }

  get status(): boolean {
    return this.props.active;
  }

  get hashPassword(): string {
    return this.props.hashPassword
  }

  get active(): boolean {
    return this.props.active;
  }
}
