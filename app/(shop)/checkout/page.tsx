import Link from "next/link";
import Image from "next/image"
import { Title } from "@/components/ui";
import { initialData } from "@/seed/seed";
import { QuantitySelector } from "@/components";

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2]
]

export default function () {
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-250">
                <Title title="Verificar orden" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m">
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Ajustar compra</span>
                        <Link href="/cart" className="underline mb-5">Editar carrito</Link>


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
                                        <p>${product.price} x3</p>
                                        <p className="font-bold">Subtotal: ${product.price * 3}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="rounded-xl shadow-xl bg-white p-7">
                        <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
                        <div className="mb-10">
                            <p className="text-xl">Javier Sebastián</p>
                            <p>Leonardo Olivera s/n</p>
                            <p>Playa Verde</p>
                            <p>Maldonado</p>
                            <p>CP20200</p>
                            <p>099123123</p>
                        </div>

                        <div className="w-full rounded h-0.5" />
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
                            <p className="mb-5">
                                <span className="text-sm">
                                    Al hacer click en "Colocar orden" aceptas nuestros términos y condiciones de uso y política de privacidad
                                </span>
                            </p>
                            <Link className="flex btn-primary justify-center" href="orders/123">Colocar orden</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}