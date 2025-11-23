import { randomUUID } from "crypto";
import { Either, failure, success } from "../errors/either";

export interface TransactionProps {
  _id: string;
  walletId: string;
  type: "CREDITO" | "DEBITO" | "ESTORNO";
  value: number;
  timestamp: number;
}

type CreateTransaction = Either<{ message: string , success: boolean }, Transaction>;

export class Transaction {
  private constructor(private props: TransactionProps) {}

  static with(props: TransactionProps) {
    return new Transaction(props);
  }

  static createTransaction(
    walletId: string,
    value: number,
    type: "CREDITO" | "DEBITO" | "ESTORNO"
  ): CreateTransaction {
    return success(
      new Transaction({
        _id: randomUUID().toString(),
        walletId: walletId,
        type: type,
        value: value,
        timestamp: Date.now(),
      })
    );
  }

  get id(): string {
    return this.props._id;
  }

  get walletId(): string {
    return this.props.walletId;
  }

  get timestamp(): number {
    return this.props.timestamp;
  }

  get value(): number {
    return this.props.value;
  }

  get type(): "CREDITO" | "DEBITO" | "ESTORNO" {
    return this.props.type;
  }
}
