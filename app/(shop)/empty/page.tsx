import Link from "next/link";
import { Suspense } from "react";
import { IoCartOutline } from "react-icons/io5";

export default function () {
    return (
        <Suspense fallback="loading">
            <div className="flex justify-center items-center h-100 fade-in">
                <IoCartOutline size={75} className="mx-5" />
                <div className="flex flex-col items-start">
                    <h1 className="text-xl font-semibold">Empty cart</h1>
                    <p className="text-l mt-1" >
                        <span>Do you want to </span>
                        <Link className="text-brand-burnt-peach hover:underline" href="/">shop</Link>
                        <span> somethig? </span>
                    </p>
                </div>
            </div>
        </Suspense>
    );
}