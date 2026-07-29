'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { success } from 'zod';
import { deleteProductImage } from './deleteProductimage';

export const deleteProduct = async (productId: string) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return {
      success: false,
      message: 'You need to be an administrator user for use this server action',
    };
  }

  try {
    const productDB = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        slug: true,
        productImages: true,
        orderItems: true,
      },
    });

    if (!productDB) {
      throw new Error("This product doesn't exits.");
    }

    if (productDB.orderItems.length > 0) throw new Error("There's orders pendimg.");

    const imagesFromBucket = productDB.productImages.filter((image) =>
      image.url.startsWith('http')
    );

    const deletedImagesPromises = imagesFromBucket.map(async (image) => {
      return await deleteProductImage(image.id, image.url);
    });

    const deletedImages = await Promise.all(deletedImagesPromises);
    const everyImageWasDeleted = deletedImages.every((result) => result.success === true);
    if (!everyImageWasDeleted) {
      throw new Error("Images couldn't be deleted");
    }

    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    if (!deleteProduct) {
      throw new Error("Product couldn't be deleted.");
    }

    revalidatePath('/admin/products');
    revalidatePath(`/product/${productId}`);
    revalidatePath('/cart');
    revalidatePath('/');

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      messasge: error,
    };
  }
};
