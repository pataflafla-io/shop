'use server';

import { auth } from '@/auth.config';
import type { Address } from '@/interfaces/address.interface';
import type { Size } from '@/interfaces/product.interface';
import prisma from '@/lib/prisma';

interface PlacedOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const setPlaceOrder = async (productsInCart: PlacedOrder[], address: Address) => {
  // Se podría envíar el id del usuario desde el frontend, pero
  // dada su volatilidad, resulta más seguro obtenerlo de la session.
  const session = await auth();
  const userId = session?.user.id;

  // Teoricamente, ésto no debería de suceder, si sucede es porque
  // se está llamando a éste server action desde vaya saber donde.
  if (!userId) {
    return {
      success: false,
      message: "There's no user session.",
    };
  }

  // Obtengo las información de los productos que se están llevando
  // para realizar los cálculos correspondientes. Tener presente que
  // bajo ningún concepto se ha de realizar cálculos en el frontend.
  // Recordar que pueden llevar 2 o más productos con el mismo id
  // pero diferente talla (actualmente, los productos no están
  // segmentados por talla).
  // @todo: ¿posible mejora?, ¿para qué?
  // Para tener mayor granularidad en el manejo de stock dado que
  // al realizar la transaction, el stock se actualizará y siendo
  // la misma talla no tendríamos ese control en un escenario más
  // real.
  const productsDB = await prisma.product.findMany({
    where: {
      // Obtengo todos los productos que incluyan el id
      // que viene desde el frontend.
      id: {
        in: productsInCart.map((p) => p.productId),
      },
    },
  });

  // ¿Cuántos productos está llevando?
  const totalItems = productsInCart.reduce((total, product) => total + product.quantity, 0);

  // Calculo tax, subTotal y total
  // RECORDAR, NUNCA ESTÁ DE MÁS!
  // Jamás realizar cálculos en el frontend, el cálculo puede ser maniupulado.
  // Para dichos cálculos usamos la consulta a la base de datos realizada más
  // arriba (asignada a products), en ella tenemos los precios garantizados.
  const { tax, subtotal, total } = productsInCart.reduce(
    (totals, currentProductInCart) => {
      // Cantidad(es) del producto a llevar en la current iteración
      const quantity = currentProductInCart.quantity;

      // Obtengo el product guardado en la consulta
      const product = productsDB.find((product) => product.id === currentProductInCart.productId);

      // Esto no debería de suceder, si sucede es porque hubo manipulación desde el frontend
      if (!product) {
        throw new Error(`${currentProductInCart.productId} no existe`);
      }

      const subtotal = product.price * quantity;

      // Para acceder a variables de entorno es necesario
      // apendear NEXT_PUBLIC
      const countryTax = Number(process.env.NEXT_PUBLIC_COUNTRY_TAX) || 1;

      totals.subtotal += subtotal;
      totals.tax += (subtotal * countryTax) / 100;
      totals.total += subtotal + totals.tax;
      return totals;
    },
    { tax: 0, subtotal: 0, total: 0 }
  );

  try {
    // A realizar la transacción, documentación:
    // https://www.prisma.io/docs/orm/prisma-client/queries/transactions#interactive-transactions
    const transaction = await prisma.$transaction(async (tx) => {
      // Actualizar el stock!
      const updateStockProducts = productsDB.map((productDB) => {
        // Este reduce se realiza ya que en la base de datos los productos y las tallas
        // se guardan en el mismo registro.
        const quantity = productsInCart
          .filter((productInCart) => productInCart.productId === productDB.id)
          .reduce(
            (quantitiesOfProducts, currentProduct) =>
              quantitiesOfProducts + currentProduct.quantity,
            0
          );

        if (quantity === 0) {
          // No debería de suceder; sino, ¿cómo hizo el usuario para
          // agregarlo al carrito?
          // Existe un server action que avisa al frontend si hay
          // stock disponible
          // ROLL BACK!
          throw new Error(`${productDB.id} has no quantity`);
        }

        return tx.product.update({
          where: {
            id: productDB.id,
          },
          data: {
            inStock: {
              decrement: quantity,
            },
          },
        });
      });

      const updatedStocksProducts = await Promise.all(updateStockProducts);
      // Verifico si hay stocks con valor negativo; por lo tanto, no hay stock.
      updatedStocksProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} hasn't enough stock`);
        }
      });

      // Creo la orden
      //
      // Order schema:
      //   subtotal       Float
      //   tax            Float
      //   total          Float
      //   itemsToOrder   Int
      //   isPaid         Boolean
      //   paidAt         DateTime?
      //   createdAt      DateTime  @default(now())
      //   updatedAt      DateTime  @updatedAt
      //   userId String
      //   orderItems     OrderItem[]
      //   orderAddresses OrderAddress?
      const order = await tx.order.create({
        data: {
          subtotal: subtotal,
          tax: tax,
          total: total,
          itemsToOrder: totalItems,
          userId: userId,

          // orderItems schema:
          //   quantity Int
          //   price    Float
          //   size     Size
          //   order     Order   @relation(fields: [orderId], references: [id])
          //   orderId   String
          //   product   Product @relation(fields: [productId], references: [id])
          //   productId String
          orderItems: {
            createMany: {
              data: productsInCart.map((productInCart) => ({
                quantity: productInCart.quantity,
                size: productInCart.size,
                price:
                  productsDB.find((productDB) => productDB.id === productInCart.productId)?.price ??
                  0,
                productId: productInCart.productId,
              })),
            },
          },
        },
      });

      // Valido si existe algún precio en 0, es muy poco probable que eso
      // suceda; peeeeeero, es bueno extra de validación para no impactar
      // en la bd y hacer un rollback de la transaction.
      if (productsDB.find((p) => p.price === 0)) {
        // Esto no debería de ocurrir, salvo que alguien halla
        // impactado en la base datos un price con 0.
        // ROLL BACK! ROLL BACK! ROLL BACK!
        throw new Error("There's an item with price 0");
      }

      // Crear la dirección
      //
      // OrderAddress schema:
      //   firstName String
      //   lastName  String
      //   address   String
      //   address2  String?
      //   zipCode   String
      //   city      String
      //   phone     String
      //   countryId String
      //   orderId String @unique
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2 || '',
          zipCode: address.zipCode,
          city: address.city,
          phone: address.phone,
          countryId: address.country,
          orderId: order.id,
        },
      });

      // Si todo fue bien, retornamos la orden creada
      return {
        order: order,
        address: orderAddress,
        stock: updatedStocksProducts,
      };
    });

    return {
      success: true,
      order: transaction.order,
      transaction: transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message,
    };
  }
};
