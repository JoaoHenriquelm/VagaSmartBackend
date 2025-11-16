import { Vehicle } from "../../entities/vehicle";
import { Wallet } from "../../entities/wallet";
import { prisma } from "../../services/prisma";
import { WalletRepository } from "../wallet-repository";

export class SqliteWallet implements WalletRepository {
    async findWalletPerUserId(userId: string): Promise<Wallet | null> {
        const searchWallet =  await prisma.wallet.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!searchWallet) {
            return null;
        }
        const walletEntity = Wallet.with({
            _id: searchWallet.id,
            balance: searchWallet.balance,
            userId: searchWallet.userId,
        });
        return walletEntity;
    }

    async store(wallet: Wallet): Promise<void> {
        await prisma.wallet.create({
            data: {
                id: wallet.id,
                balance: wallet.balance,
                userId: wallet.userId,
            },
        });
    }

    async update(wallet: Wallet): Promise<void> {
        await prisma.wallet.update({
            where: {
                id: wallet.id,
            },
            data: {
                balance: wallet.balance,
            },
        });

    }
}
