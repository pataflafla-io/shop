'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const doRegister = async (name: string, email: string, password: string) => {
  try {
    const createUser = await prisma.user.create({
      data: {
        name: name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "User couldn't be created.",
    };
  }
};
