import { Transaction } from "../entities/transaction";

export interface TransactionRepository {
  store(transaction: Transaction): Promise<void>;
  
}
