'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL ?? '');

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message: 'You need to be an administrator user for use this server action',
    };
  }

  // Borrar imágenes del filesystem no tiene sentido ya que:
  // 1- las imágenes van a estar alojadas en un bucket
  // 2- las imágenes que se encuentren en el fs son del seed
  if (!imageUrl.startsWith('http')) {
    return {
      success: false,
      message: "This server action doesn't delete filesystem images",
    };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';
  try {
    // No es deseable estar dejando imágenes en el bucket que ya no
    // se van a usar. Reciclemos bits!
    cloudinary.uploader.destroy(imageName);
    const deleteImage = await prisma.productImage.delete({
      where: {
        id: imageId,
      },
      // El slug se usa para revalidar el caché
      select: {
        product: {
          select: {
            slug: true,
          },
        },
      },
    });

    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${deleteImage.product.slug}`);
    revalidatePath(`/product/${deleteImage.product.slug}`);
  } catch (error) {
    return {
      success: false,
      message: "Image couldn't be deleted.",
    };
  }
};
