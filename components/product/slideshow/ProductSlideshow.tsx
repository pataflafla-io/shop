'use client';

import { useState } from 'react';
// Import Swiper React components
import { Swiper as SwiperObject } from 'swiper';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './slideshow.css';
import { usePathname } from 'next/navigation';
import { ProductImage } from '@/components/product/productImage/ProductImage';

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductSlideShow = ({ images, title, className }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject | null>(null);
  const pathname = usePathname();

  return (
    <div className={className}>
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{ delay: 2500 }}
        // Cuando se visita por primera vez un item, Swiper renderiza
        // de forma correcta; ahora, si salimos y volvemos a entrar al
        // mismo item (incluso si se refresca la página), entonces se
        // dispara el error siguiente:
        // Cannot read properties of undefined (reading 'classList')
        //
        // Eso se debe a que se usan 2 instancias de Swiper para la
        // navegación y es posible que se intente acceder a elementos
        // del DOM que aún no están renderizados.
        // ¿Por qué?
        // Next.js (en realidad React's reconciliation:
        // https://medium.com/@skmanjuralli9/react-reconciliation-and-fiber-a-comprehensive-guide-3c792bf25616)
        // no destruye el html y lo reconstruye desde 0 al ver que
        // es el mismo elemento (Swiper); en vez de unmount/mount
        // lo que hace es actualizar las props de la galería.
        // Ahora, Next.js, en la transición altera el DOM.
        // https://github.com/nolimits4web/swiper/issues/6335
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
        key={pathname}
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              alt={title}
              className="rounded-xl object-cover"
              height={512}
              src={image}
              width={512}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              alt={title}
              className="rounded-xl object-contain"
              height={512}
              src={image}
              width={512}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
