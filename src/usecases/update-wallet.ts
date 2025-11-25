import { Transaction } from "../entities/transaction";
import { Either, failure, success } from "../errors/either";
import { TransactionRepository } from "../repositories/transaction-repository";
import { WalletRepository } from "../repositories/wallet-repository";

export type UpdateWalletRequest = {
  value: number;
  type: "CREDITO" | "DEBITO" | "ENTRADA";
  userId: string;
};

export type UpdateWalletResponse = Either<
  { message: string; success: boolean },
  {
    message: string;
    success: boolean;
  }
>;

export interface UpdateWalletProtocol {
  execute(request: UpdateWalletRequest): Promise<UpdateWalletResponse>;
}

export class UpdateWallet implements UpdateWalletProtocol {
  constructor(
    private repositoryWallet: WalletRepository,
    private repositoryTransaction: TransactionRepository
  ) {}

  async execute(request: UpdateWalletRequest): Promise<UpdateWalletResponse> {
    if (request.value === 0) {
      return failure({
        message: "O valor da transação não pode ser igual a zero",
        success: false,
      });
    }

    const searchWallet = await this.repositoryWallet.findWalletPerUserId(
      request.userId
    );

    if (!searchWallet) {
      return failure({
        message: "Carteira não encontrada para o usuário informado",
        success: false,
      });
    }

    if(searchWallet.balance < 0) {
      return failure({
        message: "Saldo insuficiente na carteira para realizar a transação",
        success: false,
      });
    }

    const transaction = Transaction.createTransaction(
      searchWallet.id,
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
