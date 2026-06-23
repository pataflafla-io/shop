import Link from "next/link";
import Image from "next/image"
import { Title } from "@/components/ui";
import { initialData } from "@/seed/seed";
import { QuantitySelector } from "@/components";
import { redirect } from "next/navigation";

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2]
]

export default function () {
    //redirect("/empty")
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-250">
                <Title title="Carrito" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m">
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Agregar más items</span>
                        <Link href="/" className="underline mb-5">Continúa comprando</Link>


                        {
                            productsInCart.map(product => (
                                <div key={product.slug} className="flex mb-5">
                                    <Image
                                        alt={product.title}
                                        className="mr-5 rounded"
                                        height={100}
                                        src={`/products/${product.images[0]}`}
                                        width={100}
                                    />
                                    <div>
                                        <p>{product.title}</p>
                                        <p>${product.price}</p>
                                        <QuantitySelector quantity={1} />
                                        <button className="underline mt-3">remover</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="rounded-xl shadow-xl bg-white p-7 h-fit">
                        <h2 className="text-2xl mb-2">Resumen de la compra</h2>
                        <div className="grid grid-cols-2">
                            <span>No.de productos</span>
                            <span className="text-right">3 artículos</span>

                            <span>Subtotal</span>
                            <span className="text-right">$100</span>

                            <span>Impuestos (15%)</span>
                            <span className="text-right">$100</span>

                            <span className="mt-5 text-2xl">Total:</span>
                            <span className="mt-5 text-2xl text-right">$100</span>

                        </div>
                        <div className="mt-5 mb-2 w-full">
                            <Link className="flex btn-primary justify-center" href="/checkout/address">Checkout</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}