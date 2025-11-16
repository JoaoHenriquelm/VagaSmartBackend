import { Wallet } from "../entities/wallet";

export interface WalletRepository {
  store(wallet: Wallet): Promise<void>;
  update(wallet: Wallet): Promise<void>;
  findWalletPerUserId(userId: string): Promise<Wallet | null>;  
}
