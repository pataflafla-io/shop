import { titleFont } from "@/config/fonts"
import Link from "next/link"

export const Footer = () => {
    return (
        <div className="flex w-full justify-center text-md mb-10">
            <Link href="/">
                <span className={`${titleFont.className} antialiased font-bold`}>
                    pataflafla
                </span>
                <span className={`${titleFont.className} antialiased`}>
                    .io
                </span>
                <span>
                    &nbsp;|&nbsp;©{new Date().getFullYear()}
                </span>
            </Link>
        </div>
    )
}
