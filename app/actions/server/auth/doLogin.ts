'use server';

import { signIn } from '@/auth.config';
import { CredentialsSignin } from 'next-auth';

export async function authenticate(
  prevState:
    { success: boolean; message?: undefined } | { success: boolean; message: string } | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return {
      success: true,
    };
  } catch (error) {
    if ((error as CredentialsSignin).code.includes('credentials')) {
      return {
        success: false,
        message: 'Invalid cdredemtials',
      };
    }

    return {
      success: false,
      message: 'Unknown error',
    };
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', { email, password });
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: "Session couldn't be initiated",
    };
  }
};
