import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "../dto/createUser.dto";
const prisma = new PrismaClient();

export async function register(createUserDto: CreateUserDto): Promise<User> {
  const { email, name, password, age } = createUserDto;
  const newUser = await prisma.user.create({
    data: { email, name, password, age },
  });
  return newUser;
}
