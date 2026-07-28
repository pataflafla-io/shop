'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createUpdateProduct } from '@/app/actions/product/createUpdateProduct';
import { deleteProduct } from '@/app/actions/product/deleteProduct';
import { deleteProductImage } from '@/app/actions/product/deleteProductimage';
import { Product } from '@/interfaces/product.interface';
import { ProductCategory } from '@/interfaces/productCategory.interface';
import { ProductImage } from '@/interfaces/productImage.interface';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ProductImage as ProductImageCmpnt } from '@/components/product/productImage/ProductImage';

interface Props {
  product: Partial<Product> & { productImages?: ProductImage[] };
  categories: ProductCategory[];
}

interface FormInput {
  id: string;
  description: string;
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string;
  title: string;
  gender: 'men' | 'women' | 'kids' | 'unisex';
  categoryId: string;

  images?: FileList;
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export const ProductForm = ({ product, categories }: Props) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    formState: { isValid },
    getValues,
    setValue,
    watch,
  } = useForm<FormInput>({
    defaultValues: {
      ...product,
      tags: product.tags?.join(','),
      sizes: product.sizes ?? [],
      images: undefined,
    },
  });

  // useForm no repinta la pantalla cuando hay un cambio
  // en el formulario, para ello se usa la función watch.
  // Cuando se selecciona/deselecciona el size en el form
  // useForm repinta la ui mostrando el cambio.
  watch('sizes');

  const router = useRouter();

  const onSizeChanged = (size: string) => {
    // El Set functiona como un Array, con la
    // excepción que no acepta duplicados.
    // Ta'bueno bueno!!!
    const sizes = new Set(getValues('sizes'));
    sizes.has(size) ? sizes.delete(size) : sizes.add(size);
    setValue('sizes', Array.from(sizes));
    if (isValid) {
      setIsProcessing(false);
    }
  };

  const onFormSubmit = async (data: FormInput) => {
    setIsProcessing(true);
    const formData = new FormData();

    const { images, ...productToSave } = data;
    if (product.id) {
      formData.append('id', product.id ?? '');
    }

    formData.append('title', productToSave.title);
    formData.append('description', productToSave.description);
    formData.append('slug', productToSave.slug);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append('sizes', productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append('gender', productToSave.gender);
    formData.append('categoryId', productToSave.categoryId);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const { success, product: updatedOrCreatedProduct } = await createUpdateProduct(formData);
    if (!success) {
      toast.error(`Product ${product.title} couldn't be saved.`);
      return;
    }

    setValue('images', undefined);
    setIsProcessing(false);
    //router.replace('/admin/products/');
    //toast.error(`Product ${product.title} was saved.`);
  };

  return (
    <form className="px-5 mt-6 mb-16" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
        <div className="w-full">
          <div className="flex flex-col mb-3">
            <span className="text-lg">Title</span>
            <input
              type="text"
              className="p-2 rounded-md bg-gray-200"
              {...register('title', { required: true })}
            />
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Slug</span>
            <input
              type="text"
              className="p-2 rounded-md bg-gray-200"
              {...register('slug', { required: true })}
            />
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Price</span>
            <input
              type="number"
              className="p-2 rounded-md bg-gray-200"
              {...register('price', { required: true, min: 1 })}
            />
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Stock</span>
            <input
              type="number"
              className="p-2 rounded-md bg-gray-200"
              {...register('inStock', { required: true, min: 1 })}
            />
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Gender</span>
            <select
              className="p-2 rounded-md bg-gray-200"
              {...register('gender', { required: true })}
            >
              <option value="">[Seleccione]</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kid">Kid</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div className="w-1/3 mt-3">
            <div className="flex flex-col mb-3">
              <span className="text-lg">Images</span>
              <input
                type="file"
                multiple
                className="p-2 rounded-md bg-gray-200"
                accept="image/png, image/jpeg"
                {...register('images')}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex flex-col mb-3">
            <span className="text-lg">Description</span>
            <textarea
              rows={5}
              className="p-2 rounded-md bg-gray-200"
              {...register('description', { required: true })}
            ></textarea>
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Sizes</span>
            <div className="flex flex-wrap">
              {sizes.map((size) => {
                const isSelected = getValues('sizes').includes(size);
                return (
                  <div
                    key={size}
                    onClick={() => onSizeChanged(size)}
                    className={clsx(
                      'mx-2 p-2 cursor-pointer border rounded-md transition-all text-lg',
                      {
                        'hover:text-white hover:bg-brand-seaweed ': !isSelected,
                      },
                      {
                        'text-white border-brand-orange bg-brand-orange shadow-sm': isSelected,
                      }
                    )}
                  >
                    <span>{size}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col mb-3">
            <span className="text-lg">Categories</span>
            {!categories ? (
              <span>There's no categories.</span>
            ) : (
              <select
                multiple
                className="p-2 rounded-md bg-gray-200"
                {...register('categoryId', { required: true })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-lg">Tags</span>
            <input
              type="text"
              className="p-2 rounded-md bg-gray-200"
              {...register('tags', { required: true })}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:px-0 gap-3 mt-4">
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            {product.productImages?.map((image) => {
              const isFromSeed = !image.url.includes('https');
              return (
                <div key={image.url}>
                  <ProductImageCmpnt
                    alt={product.title ?? ''}
                    className={clsx('rounded-t-md', { 'saturate-0': isFromSeed })}
                    height={300}
                    src={image.url}
                    width={300}
                  />
                  <button
                    disabled={isFromSeed}
                    className={clsx(
                      'w-full rounded-b-md',
                      { 'btn-danger': !isFromSeed },
                      { 'btn-disabled': isFromSeed }
                    )}
                    type="button"
                    onClick={() => deleteProductImage(image.id, image.url)}
                  >
                    {!isFromSeed ? 'remove' : 'seeded image'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full justify-end mt-10 gap-3">
          <button
            type="button"
            className="btn-danger w-1/4"
            onClick={() => deleteProduct(product.id!)} //router.replace('/admin/products')}
          >
            Cancel
          </button>
          <button
            disabled={!isValid || isProcessing}
            type="submit"
            className={clsx(
              'w-1/4',
              { 'btn-primary cursor-pointer': isValid && !isProcessing },
              { 'btn-disabled cursor-not-allowed': !isValid || isProcessing }
            )}
          >
            {isProcessing ? 'Please wait while your request is processing' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};
