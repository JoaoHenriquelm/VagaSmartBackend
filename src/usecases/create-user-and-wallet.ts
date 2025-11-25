import { User } from "../entities/user";
import { Either, failure, success } from "../errors/either";
import { UserRepository } from "../repositories/user-repository";
import bcrypt from "bcrypt";
import { WalletRepository } from "../repositories/wallet-repository";
import { Wallet } from "../entities/wallet";

export interface CreateUserAndWalletRequest {
  name: string;
  password: string;
  email: string;
  type: "FUNCIONARIO" | "ALUNO" | "VISITANTE" | "OPERADOR";
}

export type CreateUserAndWalletResponse = Either<
  { message: string, success: boolean  },
  { message: string, success: boolean  }
>;

interface CreateUserAndWalletProtocol {
  execute(
    request: CreateUserAndWalletRequest
  ): Promise<CreateUserAndWalletResponse>;
}

export class CreateUserAndWallet implements CreateUserAndWalletProtocol {
  constructor(
    private repositoryUser: UserRepository,
    private repositoryWallet: WalletRepository
  ) {}

  async execute(
    request: CreateUserAndWalletRequest
  ): Promise<CreateUserAndWalletResponse> {
    const hashPassword = await bcrypt.hash(request.password, 8);

    const user = User.createUser(
      request.name,
      request.email,
      request.type,
      hashPassword,
    );

    if (user.isRight()) {
      const wallet = Wallet.createWallet(user.value.id, 0);
      if (wallet.isRight()) {
        await this.repositoryUser.store(user.value);
        await this.repositoryWallet.store(wallet.value);
        return success({ message: "Usuário criado com sucesso", success: true });
      } else {
        return failure(wallet.reason);
      }
    } else {
      return failure(user.reason);
    }
  }
}
