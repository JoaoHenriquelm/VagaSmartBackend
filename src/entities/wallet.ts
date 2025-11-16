import { randomUUID } from "crypto";
import { Either, failure, success } from "../errors/either";

export interface WalletProps {
  _id: string;
  userId: string;
  balance: number;
}

type CreateWallet = Either<{ message: string, success: boolean }, Wallet>;

export class Wallet {
  private constructor(private props: WalletProps) {}

  static with(props: WalletProps) {
    return new Wallet(props);
  }

  static createWallet(
    userId: string,
    balance: number,
  ): CreateWallet {
    if (!userId) {
      return failure({ message: "É obrigatório a carteira ter um usuário", success: false });
    }
    return success(
      new Wallet({
        _id: randomUUID().toString(),
        userId: userId,
        balance: balance,
      })
    );
  }

  get id(): string {
    return this.props._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get balance(): number {
    return this.props.balance;
  }
}
