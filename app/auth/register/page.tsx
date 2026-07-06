import { titleFont } from '@/config/fonts';
import { RegisterForm } from './ui/RegisterForm';

export default function () {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">

      <h1 className={`${titleFont.className} text-4xl mb-5`}>New account</h1>

      <RegisterForm />

    </div>
  );
}