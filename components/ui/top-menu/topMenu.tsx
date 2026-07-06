'use client';

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCartStore, useUIStore } from "@/store"
import { Gender } from "@/interfaces";
import { deleteCookie, getCookie, setCookie } from 'cookies-next/client'
import clsx from "clsx";
import { titleFont } from "@/config/fonts"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"

export const TopMenu = () => {

    // Trick para evitar problemas de rehydratrion
    // datdo que Zustand persite desde el lado del
    // cliente, pero la página se renderiza del lado
    // del servicor
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => setIsLoading(false), [])

    const { gender } = useParams();
    const pathname = usePathname();

    // @todo: ¿Mover para zustand?
    // Por qué?
    // Con esta implementación cubrimos casi todos los 
    // escenarios salvo cuando seleccionos un producto
    // desde la home.
    // ¿Es necesario indicar el género al acceder desde la home?
    // Sería deseable, además del valor didáctico
    // que ofrece el aprendizaje.
    // https://zustand.docs.pmnd.rs/reference/middlewares/persist

    if (pathname === "/") deleteCookie("gender")
    let genderCookie;
    if (!gender) {
        genderCookie = getCookie("gender")
    } else {
        setCookie("gender", gender)
        genderCookie = gender;
    }
    if (pathname === "/") deleteCookie("gender")
    // Fin mover para zustand?

    const totalItems = useCartStore(state => state.getTotalItens())
    const openSidebar = useUIStore(state => state.openSidebar)

    return (
        <nav className="flex px-5 justify-between items-center w-full">
            <div>
                <Link className="flex items-center p-5" href="/">
                    <Image
                        alt="Logo de Pataflafla"
                        className="mx-2"
                        height={64}
                        src="/imgs/logo.png"
                        width={64}
                    />
                    <span className={`${titleFont.className} antialiased font-bold`}>
                        pataflafla
                    </span>
                    <span className={`${titleFont.className} antialiased`}>
                        .io
                    </span>

                </Link>
            </div>
            <div className="hidden sm:block">
                <Link className={clsx("m-2 p-2 rounded-md transition-all hover:bg-brand-seaweed hover:text-white", { "bg-brand-orange text-white": genderCookie === "men" })} href="/gender/men">men</Link>
                <Link className={clsx("m-2 p-2 rounded-md transition-all hover:bg-brand-seaweed hover:text-white", { "bg-brand-orange text-white": genderCookie === "women" })} href="/gender/women">women</Link>
                <Link className={clsx("m-2 p-2 rounded-md transition-all hover:bg-brand-seaweed hover:text-white", { "bg-brand-orange text-white": genderCookie === "kids" })} href="/gender/kids">kids</Link>
            </div>
            <div className="flex items-center">
                <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>
                <Link href={(totalItems > 0 && !isLoading) ? '/cart' : '/empty'}

                    className="mx-2">
                    <div className="relative">
                        {
                            (!isLoading && totalItems > 0) && <span className="absolute -top-2 -right-2 px-1 text-xs rounded-full bg-brand-seaweed font-bold fade-in text-white">{totalItems}</span>
                        }
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button onClick={openSidebar} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">menu</button>
            </div>
        </nav >
    )
}
