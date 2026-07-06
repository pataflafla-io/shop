'use client'

import Link from "next/link"
import { useState } from "react";
import { useForm } from 'react-hook-form'
import { register as createUser, login } from "@/app/actions"
import { clsx } from "clsx"

type FormInputs = {
    name: string;
    email: string;
    password: string;
}

export const RegisterForm = () => {

    const [errorMessge, setErrorMessage] = useState<string>('');
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('')
        const { name, email, password } = data;
        const response = await createUser(name, email, password)

        if (!response.success) {
            setErrorMessage(response.message || "User couldn't be created");
            return;
        }

        await login(email, password);
        // No es la solución más bonita pero dada la forma 
        // en que next.js realiza la navegación entre páginas
        // el uso de useRouter().replace() no estaría
        // fuhcionando de la forma esperada.
        // ssignIn/signOut se realiza desde el cliente
        // mientras que la session se realiza desde el server,
        // eso genera que no se actualize la UI de la forma
        // esperada, salvo que se refresque de forma manual.
        // Por eso el uso de window.location
        window.location.replace("/profile");
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            <label htmlFor="name">Complete name</label>
            <input
                autoFocus
                className={clsx(
                    "px-5 py-2 bg-gray-200 rounded mb-5",
                    { "border-2 border-brand-burnt-peach": !!errors.name }
                )}
                type="text"
                {...register('name', { required: true, minLength: 3 })}
            />

            <label htmlFor="email">Email</label>
            <input
                className={clsx(
                    "px-5 py-2 bg-gray-200 rounded mb-5",
                    { "border-2 border-brand-burnt-peach": !!errors.email }
                )}
                type="email"
                {...register('email',
                    {
                        required: true,
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    })}
            />

            <label htmlFor="password">Password</label>
            <input
                className={clsx(
                    "px-5 py-2 bg-gray-200 rounded mb-5",
                    { "border-2 border-brand-burnt-peach": !!errors.password }
                )}
                type="password"
                {...register('password', { required: true, minLength: 6 })}
            />

            {
                errorMessge && <p className="mb-5 p-2 border-2 border-brand-burnt-peach text-center text-brand-burnt-peach">{errorMessge}</p>
            }

            <button

                className="btn-primary">
                Create account
            </button>

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Log-in
            </Link>

        </form>
    )
}
