import { Wallet } from "../entities/wallet";
import { Either, failure, success } from "../errors/either";
import { WalletRepository } from "../repositories/wallet-repository";

export type UpdateWalletsRequest = Wallet;

export type UpdateWalletResponse = Either<
  { message: string; success: boolean },
  {
    message: string;
    success: boolean;
  }
>;

export interface UpdateWalletProtocol {
  execute(request: UpdateWalletsRequest): Promise<UpdateWalletResponse>;
}

export class UpdateWallets implements UpdateWalletProtocol {
  constructor(private repositoryWallet: WalletRepository) {}

  async execute(request: UpdateWalletsRequest): Promise<UpdateWalletResponse> {
    // CONECTAR COM CRIAÇÃO DA TRANSAÇÃO E O VALOR QUE VAI AUMENTAR
    if(request.balance < 0 || request.balance === 0) {
        return failure({ message: "O saldo não pode ser menor ou igual a zero", success: false });
    }

    await this.repositoryWallet.update(request);
    
    return success({ message: "A carteira foi atualizado", success: true });
  }
}
