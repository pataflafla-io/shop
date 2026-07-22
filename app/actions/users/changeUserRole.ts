'use server';

import { revalidatePath } from 'next/cache';
import { Role } from '@/app/generated/prisma/enums';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const changeUserRole = async (id: string, newRole: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message: 'You need to be an administrator user for use this server action',
    };
  }

  try {
    // Existe una diferencia de tipos (Role vs string) dado que estamos enviando el value
    // del role obtenido a través de un event.target.value (siempre es un texto).
    // La pisadita siguiente es una forma de asegurar de setear o "admin" o "user"
    const newRoleWithCompatibility = newRole === 'admin' ? 'admin' : 'user';

    const updateRole = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        role: newRoleWithCompatibility,
      },
    });

    if (!updateRole) {
      return {
        success: false,
        message: `Role for user with id ${id} couldn't be changed`,
      };
    }

    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'Role changed',
    };
  } catch (error) {
    return {
      success: false,
      message: error,
    };
  }
};
