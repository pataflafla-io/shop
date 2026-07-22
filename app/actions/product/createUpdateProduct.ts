'use server';

import { revalidatePath } from 'next/cache';
import { Product, Size } from '@/app/generated/prisma/client';
import { Gender } from '@/interfaces/productGender.interface';
import prisma from '@/lib/prisma';
import z from 'zod';

// Esquema de validación de lo que se espera
// cuando se actualiza o se crea un producto.
// Además evita tener que hacer expresiones
// regulares por cada tipo de dato que llega
// en el formulario.
const productSchema = z.object({
  id: z.uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  // El tipo de dato que llega desde FormData es un
  // string pero en la BD está como number.
  price: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val.toFixed(2))),
  // El tipo de dato que llega desde FormData es un
  // string pero en la BD está como number.
  inStock: z.coerce
    .number()
    .min(1)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.uuid(),
  // El tipo de dato que llega desde FormData es un
  // string pero en la BD está como array.
  sizes: z.coerce.string().transform((val) => val.split(',')),
  tags: z.string(),
  // El tipo de dato que llega desde FormData es un
  // string pero en la BD está como un enum.
  gender: z.enum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);

  // Se valida el objeto que llega desde el formulario
  // contra el esquema de validación.
  const parsedProduct = productSchema.safeParse(data);
  if (!parsedProduct.success) {
    return {
      success: false,
      message: parsedProduct.error,
    };
  }

  const product = parsedProduct.data;
  // Pisada para asegurar que el slug esté todo en lowercase,
  // no tenga espacios en blanco.
  product.slug = product.slug.toLowerCase().replace(/ /g, '_').trim();

  const { id, ...restProduct } = product;

  try {
    // ¿por qué una transacción?
    // en el momento que se actualiza/crea un producto desde el admin
    // además de la data, se suben archivos (imágenes), así como
    // inserciones en las relaciones. La transacción nos asegura que si
    // algo falla, se hace un rollback.
    const prismaTx = await prisma.$transaction(async (tx) => {
      let product: Product;
      // tags es un array en la bd
      const tagsArray = restProduct.tags.split(',').map((tag) => tag.trim().toLowerCase());
      if (id) {
        // es una actualización
        product = await prisma.product.update({
          where: {
            id: id,
          },
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        // es una creación
        product = await prisma.product.create({
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }
      return { product };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return {
      success: true,
      product: prismaTx.product,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
};
