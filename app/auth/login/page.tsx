import { titleFont } from '@/config/fonts';
import { LoginForm } from './ui/LoginForm';

export default function () {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">

      <h1 className={`${titleFont.className} text-4xl mb-5`}>Sign In</h1>

      <LoginForm />
    </div>
  );
}