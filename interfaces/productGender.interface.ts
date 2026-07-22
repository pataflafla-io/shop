export const Gender = {
  men: 'men',
  women: 'women',
  kids: 'kids',
  unisex: 'unisex',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];
