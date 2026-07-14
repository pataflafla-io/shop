import { redirect } from 'next/navigation';
import { auth } from '@/auth.config';
import { titleFont } from '@/config/fonts';
import { LoginForm } from './ui/LoginForm';

export default async function () {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <h1 className={`${titleFont.className} text-4xl mb-5`}>Sign In</h1>

      <LoginForm />
    </div>
  );
}
