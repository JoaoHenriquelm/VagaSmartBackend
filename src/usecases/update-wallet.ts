import { Transaction } from "../entities/transaction";
import { Wallet } from "../entities/wallet";
import { Either, failure, success } from "../errors/either";
import { TransactionRepository } from "../repositories/transaction-repository";
import { WalletRepository } from "../repositories/wallet-repository";

export type UpdateWalletsRequest = {
  value: number;
  type: "CREDITO" | "DEBITO" | "ESTORNO";
  walletId: string;
};

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
  constructor(
    private repositoryWallet: WalletRepository,
    private repositoryTransaction: TransactionRepository
  ) {}

  async execute(request: UpdateWalletsRequest): Promise<UpdateWalletResponse> {
    if (request.value < 0 || request.value === 0) {
      return failure({
        message: "O valor da transação não pode ser menor ou igual a zero",
        success: false,
      });
    }

    const searchWallet = await this.repositoryWallet.findWalletPerUserId(
      request.walletId
    );
    if (!searchWallet) {
      return failure({
        message: "Carteira não encontrada para o usuário informado",
        success: false,
      });
    }

    const transaction = Transaction.createTransaction(
      request.walletId,
      request.value,
      request.type
    );

    if(transaction.isRight()) {
      await this.repositoryTransaction.store(transaction.value);
      searchWallet.balance += transaction.value.value;
      await this.repositoryWallet.update(searchWallet);
    }


    return success({ message: "A carteira foi atualizado", success: true });
  }
}
