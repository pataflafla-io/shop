'use client'

import Link from "next/link"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearch, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

import { useUIStore } from "@/store";
import clsx from "clsx";

export const Sidebar = () => {
    const isSidebarOpen = useUIStore(state => state.isSidebarOpen);
    const closeSidebar = useUIStore(state => state.closeSidebar);
    return (
        <div>
            {isSidebarOpen && (
                <div className="fixed z-10 top-0 left-0 w-full h-screen bg-black opacity-50" />
            )}
            {isSidebarOpen && (
                <div onClick={closeSidebar} className="fade-in fixed z-10 top-0 left-0 w-full h-screen backdrop-filter backdrop-blur-md" />
            )}


            <nav className={clsx("fixed z-20 top-0 right-0 p-5 w-100 h-screen bg-white shadow-2xl transition-all duration-300", { "translate-x-full": !isSidebarOpen })}>
                <IoCloseOutline size={50} className="absolute top-5 right-5" onClick={closeSidebar} />
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input type="text" placeholder="search" className="w-full bg-gray-50 rounded px-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-emerald-500" />
                </div>
                <Link href="/" className="flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all">
                    <IoPersonOutline size={20} />
                    <span className="ml-3 text-xl">Perfil</span>
                </Link>
                <Link href="/" className="flex items-center  p-2 hover:bg-gray-100 rounded transition-all">
                    <IoTicketOutline size={20} />
                    <span className="ml-3 text-xl">Ordenes</span>
                </Link>
                <Link href="/" className="flex items-center  p-2 hover:bg-gray-100 rounded transition-all">
                    <IoLogInOutline size={20} />
                    <span className="ml-3 text-xl">Ingresar</span>
                </Link>
                <Link href="/" className="flex items-center  p-2 hover:bg-gray-100 rounded transition-all">
                    <IoLogOutOutline size={20} />
                    <span className="ml-3 text-xl">Salir</span>
                </Link>
                <div className="w-full h-px bg-gray-200 my-5" />
                <Link href="/" className="flex items-center p-2 hover:bg-gray-100 rounded transition-all">
                    <IoShirtOutline size={20} />
                    <span className="ml-3 text-xl">Productos</span>
                </Link>
                <Link href="/" className="flex items-center  p-2 hover:bg-gray-100 rounded transition-all">
                    <IoTicketOutline size={20} />
                    <span className="ml-3 text-xl">Ordenes</span>
                </Link>
                <Link href="/" className="flex items-center  p-2 hover:bg-gray-100 rounded transition-all">
                    <IoPeopleOutline size={20} />
                    <span className="ml-3 text-xl">Usuarios</span>
                </Link>
            </nav>
        </div>
    )
}
