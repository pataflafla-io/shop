'use client';

import Link from "next/link"
import { IoCartOutline, IoSearchOutline } from "react-icons/io5"

import { titleFont } from "@/config/fonts"
import { useUIStore } from "@/store"

export const TopMenu = () => {
    const openSidebar = useUIStore(state => state.openSidebar)
    return (
        <nav className="flex px-5 justify-between items-center w-full">
            <div>
                <Link href="/">
                    <span className={`${titleFont.className} antialiased font-bold`}>
                        pataflafla
                    </span>
                    <span className={`${titleFont.className} antialiased`}>
                        .io
                    </span>

                </Link>
            </div>
            <div className="hidden sm:block">
                <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/category/men">hombres</Link>
                <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/category/women">mujeres</Link>
                <Link className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" href="/category/kid">niños</Link>
            </div>
            <div className="flex items-center">
                <Link href="/search" className="mx-2">
                    <IoSearchOutline className="w-5 h-5" />
                </Link>
                <Link href="/search" className="mx-2">
                    <div className="relative">
                        <span className="absolute -top-2 -right-2 px-1 text-xs rounded-full bg-emerald-600 font-bold text-white">3</span>
                        <IoCartOutline className="w-5 h-5" />
                    </div>
                </Link>
                <button onClick={openSidebar} className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">menu</button>
            </div>
        </nav>
    )
}
