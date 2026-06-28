import Link from "next/link";

import { Title } from "@/components/ui";
import { ProductsInCart } from "./ui/productsInCart";
import { CartSummary } from "./ui/cartSummary";

export default function () {

    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-250">
                <Title title="Cart" />
                <span>Do you <Link href="/" className="text-brand-burnt-peach hover:underline mb-5">want</Link> anything else?</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-2">
                    <div className="flex flex-col mt-2">
                        <ProductsInCart />
                    </div>
                    <div className="rounded-xl shadow-xl bg-white p-7 h-fit">
                        <CartSummary />
                        <div className="mt-5 mb-2 w-full">
                            <Link className="flex btn-primary justify-center" href="/checkout/address">Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}