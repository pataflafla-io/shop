import Image from "next/image"
import clsx from "clsx";
import { IoCartOutline } from "react-icons/io5";
import { Title } from "@/components/ui";

interface Props {
    params: {
        id: string
    }
}

export default async function ({ params }: Props) {
    const { id } = await params;
    const productsInCart = new Array()
    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-250">
                <Title title={`Orden #${id}`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 m">
                    <div className="flex flex-col mt-5">

                        <div className={clsx("flex items-center rounded-lg py-2 px-3.5 tex-xs font-bold text-white mb-5",
                            // { "bg-red-500": true }
                            { "bg-green-700": true }
                        )}>
                            <IoCartOutline size={30} />
                            {/* <span className="mx-2">Pendiente de pago</span> */}
                            <span className="mx-2">Pagada</span>
                        </div>

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

                            <div className={clsx("flex items-center rounded-lg py-2 px-3.5 tex-xs font-bold text-white mb-5",
                                // { "bg-red-500": true }
                                { "bg-green-700": true }
                            )}>
                                <IoCartOutline size={30} />
                                {/* <span className="mx-2">Pendiente de pago</span> */}
                                <span className="mx-2">Pagada</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}