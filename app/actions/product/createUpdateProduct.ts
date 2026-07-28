'use server';

import { revalidatePath } from 'next/cache';
import { Product, Size } from '@/app/generated/prisma/client';
import { auth } from '@/auth.config';
import { Gender } from '@/interfaces/productGender.interface';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import z from 'zod';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

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
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message: 'You need to be an administrator user for use this server action',
    };
  }

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
  // y no tenga espacios en blanco.
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

      // Proceso de carga y guardado de imágenes, en éste
      // punto, aún seguimos en la transacción; si algo falla
      // entonces se hace un rollback.
      // Las imágenes no se guardan en el filesystem (public)
      // ¿Por qué?
      // En caso de un cambio de versión, seeding, etc
      // se barre con todo y quizás no sea lo que se busca;
      // en su lugar, las imágenes se alojan en un image bucket
      // (cloudinary, cloudflare, firebase, google cloud).

      // Si el formdata trae imágenes, éstas pueden ser
      // opcionales.
      if (formData.getAll('images')) {
        // La respuesta debería de ser algo así como:
        // https://url.jpg[]
        const images = await uploadImages(formData.getAll('images') as File[]);

        // Si falla la subida de archivos, roll back con la transaction!
        if (!images) {
          throw 'There was an error with the image(s) upload.';
        }
        // De lo contrario, actualizamos la bd con las urls!
        await prisma.productImage.createMany({
          data: images.map((image) => ({
            // en éste punto, si o si, la imagen existe!
            url: image!,
            productId: product.id,
          })),
        });
      }

      return { product };
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${product.slug}`);
    revalidatePath(`/product/${product.slug}`);

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

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob
        // https://developer.mozilla.org/en-US/docs/Web/API/Blob/arrayBuffer
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(`Image ${image} couldn't be uploaded.`);
        return null;
      }
    });

    // Arreglo de strings cargadas de forma paralela.
    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log("Images couldn't be uploaded.");
    return null;
  }
};
