import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../app/generated/prisma/client';
import 'dotenv/config';
import { initialData } from './seedData';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [...initialData.users];

const categoryData: Prisma.CategoryCreateInput[] = [...initialData.categories];

const countryData: Prisma.CountryCreateInput[] = [...initialData.countries];

export async function main() {
  // Elimino todas las entradas
  // Podría ser más performante usar un Promise.all
  // pero eso no garantiza el orden de finalizado
  // provocando, posiblemente, registros huerfanos
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.country.deleteMany();
  await prisma.user.deleteMany();

  // Creo usuarios
  await prisma.user.createMany({ data: userData });

  // Creo paises
  await prisma.country.createMany({
    data: countryData,
  });

  //Creo categorías
  for (const category of categoryData) {
    await prisma.category.create({ data: category });
  }

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>
  );

  const products = initialData.products;
  products.map(async (product) => {
    const { type, images, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));
    await prisma.productImage.createMany({
      data: imagesData,
    });
  });
}

main();
