'use client'

import Link from "next/link"
import { useActionState, useEffect } from "react"
import { authenticate } from "@/app/actions/"
import clsx from "clsx"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {

    const [state, dispatch, isPending] = useActionState(authenticate, undefined);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/'


    useEffect(() => {
        if (state?.success === true) {
            // No es la solución más bonita pero dada la forma 
            // en que next.js realiza la navegación entre páginas
            // el uso de useRouter().replace() no estaría
            // fuhcionando de la forma esperada.
            // ssignIn/signOut se realiza desde el cliente
            // mientras que la session se realiza desde el server,
            // eso genera que no se actualize la UI de la forma
            // esperada, salvo que se refresque de forma manual.
            // Por eso el uso de window.location
            window.location.replace(callbackUrl);
        }
    }, [state])

    return (

        <form action={dispatch} className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
                className="px-5 py-2 bg-gray-200 rounded mb-5"
                name="email"
                type="email" />

            <label htmlFor="email">Password</label>
            <input
                className="px-5 py-2 bg-gray-200 rounded mb-5"
                name="password"
                type="password" />


            {state?.success === false && <p className="mb-5 p-2 border-2 border-brand-burnt-peach text-center text-brand-burnt-peach">{state.message}</p>}

            <button
                aria-disabled={isPending}
                disabled={isPending}
                type="submit"
                className={clsx("btn-primary", { "btn-secondary": isPending })}>
                {!isPending ? "Log-in" : "Please wait"}
            </button>

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/register"
                className="btn-secondary text-center">
                Create new account
            </Link>
        </form>
    )
}

