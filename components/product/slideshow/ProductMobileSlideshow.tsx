'use client'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';

import Image from 'next/image';

interface Props {
    images: string[],
    title: string,
    className?: string
}

export const ProductMobileSlideShow = ({ images, title, className }: Props) => {
    return (
        <div className={className}>
            <Swiper
                style={{ width: '100vw', height: '500px' }}
                pagination={true}
                navigation={true}
                autoplay={{ delay: 2500 }}
                modules={[FreeMode, Autoplay, Pagination]}
                className="mySwiper2"
            >
                {images.map(image => (
                    <SwiperSlide key={image}>
                        <Image
                            alt={title}
                            className='object-fill'
                            height={500}
                            src={`/products/${image}`}
                            width={600}
                        />
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>
    );
};