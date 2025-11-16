import { User } from "../entities/user";

export interface UserRepository {
  store(user: User): Promise<void>;
  findUserPerEmail(email: string): Promise<User | null>;
  findUserPerId(id: string): Promise<User | null>;
}
