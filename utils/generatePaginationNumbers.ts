// [1,2,3,...,6,7,8]
// [1,2,3,...,48,49,50]
export const generatePagination = (currentPage: number, totalPages: number) => {
  // Si el total de paginas es menor a 7
  // se muestran todos los numeros sin puntos suspensivos
  if (totalPages <= 8) {
    return Array.from({ length: totalPages }, (_, i) => i + 1); // [1,2,3,4,5,6,7,8]
  }

  // Si la página actual está entre las primeras 3 páginas
  // mostramos primeras 3, puntos suspensivos, y las últimas 3
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]; // [1,2,3,...,48,49,50]
  }

  // Si la página actual está entre las últimas 3 páginas
  // mostramos primeras 3, puntos suspensivos, y las últimas 3
  if (currentPage <= totalPages - 3) {
    return [1, 2, 3, '...', totalPages - 2, totalPages - 1, totalPages]; // [1,2,3,...,48,49,50]
  }

  // Si la página actual en otro lugar en el medio
  // mostramos la primer página, puntos suspensivos, la pagina actual,
  // vecinos, puntos suspensivos y la última página
  // [1, ..., 30, 31, 32, ..., 50]
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};
