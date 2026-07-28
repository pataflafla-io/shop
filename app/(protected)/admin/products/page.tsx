import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPaginatedProductsWithImages } from '@/app/actions/products/getPaginatedProductsWithImages';
import { auth } from '@/auth.config';
import { currencyFormat } from '@/utils/currencyFormat';
import { ProductImage } from '@/components/product/productImage/ProductImage';
import { Pagination } from '@/components/ui/pagination/Pagination';
import { Title } from '@/components/ui/title/Title';

interface Props {
  searchParams: {
    page?: string;
  };
}

const getPagination = async (page: number) => {
  return await getPaginatedProductsWithImages({ page: page });
};

export default async function ({ searchParams }: Props) {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    redirect('/');
  }

  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;
  const { products, totalPages } = await getPagination(pageNumber);

  return (
    <>
      <div className="flex justify-between">
        <Title title="Product mantainance" />
        <Link href="/admin/products/new" className="btn-primary">
          Add new product
        </Link>
      </div>
      <div className="mt-6 mb-20 overflow-hidden rounded-lg shadow-xl">
        <table className="min-w-full">
          <thead className="border-b border-gray-200 bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Image
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Product name
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Gender
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Sizes
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {!products?.length ? (
              <tr className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100">
                <td
                  colSpan={4}
                  className="text-center px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900"
                >
                  <p>There's no product in your store.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 bg-white transition duration-300 ease-in-out hover:bg-gray-100"
                >
                  <td className="p-4">
                    <Link href={`/product/${product.slug}`}>
                      <ProductImage
                        alt={product.title}
                        className="rounded-md"
                        height={300}
                        src={product.productImages[0]?.url}
                        width={300}
                      />
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    <Link href={`/admin/products/${product.slug}`}>{product.title}</Link>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-gray-900">
                    {currencyFormat(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm font-light whitespace-nowrap text-gray-900">
                    {product.gender}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-gray-900">
                    {product.inStock}
                  </td>
                  <td className="px-6 py-4 text-sm font-light whitespace-nowrap text-gray-900">
                    {product.sizes.join(', ')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages && totalPages > 1 && <Pagination totalPages={totalPages} />}
    </>
  );
}
