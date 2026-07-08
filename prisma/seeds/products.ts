export interface SeedProduct {
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ValidSizes[];
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    gender: 'men' | 'women' | 'kids'
}

export type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type ValidTypes = 'shirts' | 'pants' | 'dress' | 'coats' | 'blazer' | 'knit' | 'jeans' | 'skirts' | 'jackets' | 'suits' | 'overshirts' | 'hoodies' | 't-shirts'
