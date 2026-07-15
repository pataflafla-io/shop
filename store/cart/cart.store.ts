import { CartProduct } from '@/interfaces';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
  cart: CartProduct[];

  // Agrega y/o actualiza los productos en el cart
  // basado en el size seleccionado.
  addProductToCart: (product: CartProduct) => void;

  // Actualiza la cantidad de productos
  updateProductQuantity: (product: CartProduct, quantity: number) => void;

  // Elimina un producto del cart
  removeProductFromCart: (product: CartProduct) => void;

  // Limpio el cart
  clearCart: () => void;

  // IMPORTANTE:
  // Dado que el store se ejecuta en el cliente, y se persiste
  // en el localStorage; estos métodos se usan en el frontend
  // para no tener que estar pegando en el backend constatemente
  // a la hora de realizar cálculos.
  // Una vez que el cliente hace "Place Order", los verdaderos
  // cálculos se realizan en el backend basado en la quantity,
  // y el id del producto, de esa forma se previene posibles
  // manipulaciones.
  getCartSummary: () => {
    subTotal: number;
    tax: number;
    total: number;
    totalItems: number;
  };
  _hasHydrated: boolean;
  _setHasHydrated: (isHydrated: boolean) => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      addProductToCart: (product: CartProduct) => {
        // Devuelve el estado actual del cart
        const { cart } = get();

        // Determinamos si el producto con la talla especificada
        // existe en el cart
        const productsInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        // Si no existe, se agrega
        if (!productsInCart) {
          set({
            cart: [...cart, product],
          });
          return;
        }

        // Si existe, actualiza
        const updatedCart = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }
          return item;
        });
        set({ cart: updatedCart });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();
        const updatedQuantity = cart.map((item) => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        set({ cart: updatedQuantity });
      },

      removeProductFromCart: (product: CartProduct) => {
        const { cart } = get();
        const itemToRemove = cart.filter(
          (item) => !(item.id === product.id && item.size === product.size)
        );
        set({ cart: itemToRemove });
      },

      clearCart: () => {
        set({ cart: [] });
      },
      // IMPORTANTE
      // @version: Zustand ^5...
      //
      // Se dispara un bucle inifinito si se intenta desestructurar un objeto como el
      // que se retorna debido a la naturaleza propia del lenguaje. Al igual que los Arrays,
      // éstos son mutables y se pasan por referencia, es decir un mismo" objeto/array no es
      // el mismo  ([] === [] = false ... O_O) ya que ocupan espacios de memoria diferentes.
      // Debido "a eso", Next.js genera re-renders de forma infinita.
      //
      // Cart, Cart Summary and Checkout son los lugares donde se agrupan esas propiedades
      // dada su estrecha relación.
      // Dado éste escenario, una alternativa sería definir cada propiedad ( subtotal, tax,
      // totalItems y totalItems) de forma atómica.
      // ¿Funciona? Perfectamente; aunque, crear 4 métodos que están estrechamente
      // relacionados parece más bien un workaround.
      //
      // Afortunadamente Zustand ofrece el método useShallow para prevenir dicho
      // comportamiento.
      // https://zustand.docs.pmnd.rs/learn/guides/prevent-rerenders-with-use-shallow
      //
      // La forma de usar es:
      // const { subtototal, tax ... } = useCartStore(useShallow((state) => state.getSummary()))

      getCartSummary: () => {
        // Para acceder a variables de entorno es necesario apendear NEXT_PUBLIC
        const countryTax = Number(process.env.NEXT_PUBLIC_COUNTRY_TAX) || 1;

        const { cart } = get();
        const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const tax = (subTotal * countryTax) / 100;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = subTotal + tax;

        return {
          subTotal,
          tax,
          totalItems,
          total,
        };
      },
      _hasHydrated: false,
      _setHasHydrated: (isHydrated) => {
        set({
          _hasHydrated: isHydrated,
        });
      },
    }),
    {
      name: 'shoppingCart',
      onRehydrateStorage: (state) => {
        // Para evitar el error de hydration hago uso de ésta API
        // junto con _hasHydrated y _setHasHydrated.
        // Es una alternativo más elegante al pattern de
        // useState/useEffect del lado del cliente para lograr lo mismo.
        //
        // https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data
        return () => state._setHasHydrated(true);
      },
    }
  )
);
