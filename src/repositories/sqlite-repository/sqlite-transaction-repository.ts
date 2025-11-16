import { Transaction } from "../../entities/transaction";
import { prisma } from "../../services/prisma";
import { TransactionRepository } from "../transaction-repository";

export class SqliteTransaction implements TransactionRepository {
    async store(transaction: Transaction): Promise<void> {
        await prisma.transaction.create({
            data: {
                id: transaction.id,
                type: transaction.type,
                value: transaction.value,
                walletId: transaction.walletId,
                timestamp: transaction.timestamp,
            },
        });
        
    }
}