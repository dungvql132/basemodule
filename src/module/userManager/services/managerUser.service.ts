// Import necessary modules and dependencies
import bcrypt from "bcryptjs";
import { PrismaClient, User } from "@prisma/client";
import {
  ApiDuplicateError,
  ApiNotFoundError,
} from "@src/base/interface/ApiError";
import { UpdateUserDto } from "../dto/updateUser.dto";
import {
  convertDeletedEmailToEmail,
  convertEmailToDeletedEmail,
} from "../utils/formatDeletedEmail";
import { logoutAll } from "@src/module/auth/services/auth.service";
import { ObjectMessage } from "@src/base/message";

// Create an instance of the Prisma client
const prisma = new PrismaClient();

// Function to update a user's information
export async function updateUser(
  userId: number,
  updateUserDto: UpdateUserDto
): Promise<User> {
  const { email, name, password, age } = updateUserDto;
  let hashPassword;

  // Hash the password if provided
  if (password) {
    hashPassword = await bcrypt.hash(password, 10);
  }

  // Check if the user exists
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
      active: true,
    },
  });

  if (!checkUser) {
    throw new ApiNotFoundError(ObjectMessage.USER);
  }

  // Update the user's information
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
      active: true,
    },
    data: {
      email,
      name,
      password: hashPassword,
      age,
    },
  });

  return updatedUser;
}

// Function to delete a user
export async function deleteUser(userId: number): Promise<User> {
  // Check if the user exists
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
      active: true,
    },
  });

  if (!checkUser) {
    throw new ApiNotFoundError(ObjectMessage.USER);
  }

  // Update the user's information to mark as deleted
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
      active: true,
    },
    data: {
      email: convertEmailToDeletedEmail(checkUser.email, userId),
      active: false,
    },
  });

  // Delete associated tokens
  await logoutAll(updatedUser.id);

  return updatedUser;
}

export async function reactiveUser(userId: number): Promise<User> {
  // Check if the user exists
  const checkUser = await prisma.user.findFirst({
    where: {
      id: userId,
      active: false,
    },
  });

  if (!checkUser) {
    throw new ApiNotFoundError(ObjectMessage.USER);
  }

  const reactiveEmail = convertDeletedEmailToEmail(checkUser.email, userId);

  const checkEmailUser = await prisma.user.findFirst({
    where: {
      email: reactiveEmail,
    },
  });

  if (checkEmailUser) {
    throw new ApiDuplicateError(ObjectMessage.EMAIL);
  }

  // Update the user's information to mark as deleted
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email: reactiveEmail,
      active: true,
    },
  });

  return updatedUser;
}
