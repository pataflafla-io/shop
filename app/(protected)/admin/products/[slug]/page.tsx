import { redirect } from 'next/navigation';
import { getProductCategories } from '@/app/actions/product/getProductCategories';
import { getProductBySlug } from '@/app/actions/products/getProductBySlug';
import { auth } from '@/auth.config';
import { Title } from '@/components/ui/title/Title';
import { ProductForm } from './ui/productForm';

interface Props {
  params: {
    slug: string;
  };
}

export default async function AdminProductPage({ params }: Props) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  const { slug } = await params;

  const [product, categories] = await Promise.all([getProductBySlug(slug), getProductCategories()]);

  if (!product && slug !== 'new') {
    redirect('/admin/products');
  }

  const title = slug === 'new' ? 'Add new product' : 'Edit product';

  return (
    <div>
      <Title title={title} />
      <ProductForm product={product ?? {}} categories={categories} />
    </div>
  );
}
