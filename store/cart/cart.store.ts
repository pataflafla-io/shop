
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartProduct } from "@/interfaces";

interface State {
    cart: CartProduct[],

    // Agrega y/o actualiza los productos en el cart
    // basado en el size seleccionado.
    addProductToCart: (product: CartProduct) => void;

    // Actualiza la cantidad de productos
    updateProductQuantity: (product: CartProduct, quantity: number) => void;

    // Elimina un producto del cart
    removeProductFromCart: (product: CartProduct) => void;

    // Devolver un objeto desde el store, y cuando es persistido, dispara un:
    // "Hydration failed because the server rendered text didn't match the client..."
    // getCartSummary: () => {
    //     subTotal: number,
    //     tax: number,
    //     totalItems: number,
    //     total: number
    // }
    // 
    // El patrón setState/useEffect no funciona.
    // El objetivo inicial era devolver un objeto con las referencias a las funciones
    // relacionadas al summary (objeto de arriba). Dado el error, las implementaciones
    // de cada funcionalidad se realizan de forma independiente.
    // @toDo: ver una forma de resolverlo. Leer documentación de Zustand.
    getSummaryTax: () => number,
    getSummarySubtotal: () => number,
    getSummaryTotal: () => number,


    // Devuele la cantidad de items para ser mostrada en
    // el ícono del carrito,
    getTotalItens: () => number;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],

            addProductToCart: (product: CartProduct) => {

                // Devuelve el estado actual del cart
                const { cart } = get()

                // Determinamos si el producto con la talla especificada
                // existe en el cart
                const productsInCart = cart.some(item => item.id === product.id && item.size === product.size)

                // Si no existe, se agrega
                if (!productsInCart) {
                    set({
                        cart: [
                            ...cart,
                            product
                        ]
                    })
                    return;
                }

                // Si existe, actualiza
                const updatedCart = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }
                    return item;
                })
                set({ cart: updatedCart })

            },

            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();
                const updatedQuantity = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity }
                    }
                    return item;
                })
                set({ cart: updatedQuantity })
            },

            removeProductFromCart: (product: CartProduct) => {
                const { cart } = get();
                const itemToRemove = cart.filter(item =>
                    !(item.id === product.id && item.size === product.size)
                )
                set({ cart: itemToRemove })
            },
            // getCartSummary: () => {
            //     const { cart } = get();
            //     const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            //     const tax = subTotal * 0.15;
            //     const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            //     const total = subTotal + tax;

            //     return {
            //         subTotal,
            //         tax,
            //         totalItems,
            //         total,
            //     }
            // },
            getSummarySubtotal: () => {
                const { cart } = get();
                const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                return subTotal;
            },
            getSummaryTax: () => {
                const { getSummarySubtotal } = get();
                const tax = getSummarySubtotal() * 0.15;
                return tax;
            },
            getSummaryTotal: () => {
                const { getSummarySubtotal, getSummaryTax } = get();
                const total = getSummarySubtotal() + getSummaryTax();
                return total;
            },
            getTotalItens: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0)
            }

        }),
        {
            name: "shoppingCart"
        }
    )
)
