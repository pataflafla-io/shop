'use client'

import { generatePagination } from '@/utils'
import clsx from 'clsx'
import Link from 'next/link'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface Props {
    totalPages: number
}

export const Pagination = ({ totalPages }: Props) => {

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page') ? searchParams.get('page') : 1) ?? 1;

    if (isNaN(currentPage)) {
        redirect("/")
    }

    // Todas las páginas
    const allPages = generatePagination(currentPage, totalPages)

    // Idea inspirada en https://nextjs.org/learn/dashboard-app/adding-search-and-pagination
    const createPageUrl = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        if (pageNumber === '...') {
            return `${pathname}?${params.toString()}`
        }
        if (Number(pageNumber) <= 0) {
            return `${pathname}`
        }
        if (Number(pageNumber) > totalPages) {
            return `${pathname}?${params.toString()}`
        }
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="flex text-centers mt-10 mb-12 justify-center">
            <nav aria-label="Page navigation example">
                <ul className="flex list-style-none">
                    <li className="page-item">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
                            href={createPageUrl(currentPage - 1)}   >
                            <IoChevronBackOutline size={30} />
                        </Link>
                    </li>

                    {allPages.map((page, i) => (
                        <li key={`page-${i}`} className="page-item">
                            <Link
                                className={clsx(
                                    "page-link relative block py-1.5 px-3 rounded border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:bg-brand-seaweed hover:text-white focus:shadow-none",
                                    { 'bg-brand-orange shadow-sm text-white hover:text-white hover:bg-brand-orange': page === currentPage })
                                }
                                href={createPageUrl(page)}>
                                {page}
                            </Link>
                        </li>

                    ))}




                    <li className="page-item">
                        <Link
                            className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 focus:shadow-none"
                            href={createPageUrl(currentPage + 1)}>
                            <IoChevronForwardOutline size={30} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div >
    )
}
