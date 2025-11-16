import { User } from "../../entities/user";
import { prisma } from "../../services/prisma";
import { UserRepository } from "../user-repository";

export class SqliteUser implements UserRepository {
  async findUserPerEmail(email: string): Promise<User | null> {
    const searchUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!searchUser) {
      return null;
    }
    const userEntity = User.with({
      _id: searchUser.id,
      active: searchUser.active,
      email: searchUser.email,
      name: searchUser.name,
      hashPassword: searchUser.hashPassword,
      type: searchUser.type as "FUNCIONARIO" | "ALUNO" | "VISITANTE",
    });
    return userEntity;
  }

  async findUserPerId(id: string): Promise<User | null> {
    const searchUser = await prisma.user.findUnique({
      where: {
        id: id,
        },
    });
    if (!searchUser) {
      return null;
    }
    const userEntity = User.with({
      _id: searchUser.id,
      active: searchUser.active,
      email: searchUser.email,
      name: searchUser.name,
      hashPassword: searchUser.hashPassword,
      type: searchUser.type as "FUNCIONARIO" | "ALUNO" | "VISITANTE",
    });
    return userEntity;
  }

  async store(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        hashPassword: user.hashPassword,
        active: user.active,
      },
    });
  }
}
