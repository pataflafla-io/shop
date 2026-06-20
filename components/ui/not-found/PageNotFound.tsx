import { titleFont } from "@/config/fonts"
import Image from "next/image"
import Link from "next/link"

export const PageNotFound = () => {
    return (
        <div className="flex flex-col h-125 w-full justify-center items-center align-middle">
            <div className="hidden md:block md:mx-5">
                <Image
                    alt="Logo del sitio usada para mostrar un error de página no encontrada"
                    className="p-5 sm:p-0"
                    height={256}
                    src="/imgs/logo.png"
                    width={256}
                />
            </div>
            <div className="text-center mx-5">
                <h1 className={`${titleFont.className} antialiased text-9xl`}>404</h1>
                <p className="font-semibold text-xl">TuntuPA! Lo sentimos mucho</p>
                <p className="font-light">
                    <span>Puedes regresar a la página de </span>
                    <Link className="font-normal transition-all hover:underline" href="/">inicio</Link>
                </p>
            </div>
        </div>
    )
}
