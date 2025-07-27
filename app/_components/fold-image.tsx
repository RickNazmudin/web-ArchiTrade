"use client";

import { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const images = [
  '/ebook1.jpg',
  '/ebook2.jpg',
  '/ebook3.jpg',
  '/ebook4.jpg'
];

export const ToolsMarquee = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <div className="my-[12vh] border-b pb-24 border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content - Larger */}
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Ebook ArchiTrade
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Trading Forex dari Nol Panduan Lengkap untuk Pemula hingga mahir. Pelajari strategi terbaik, manajemen risiko, dan psikologi trading dari para ahli.
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 mb-8">
              <span className="text-gray-400 line-through text-2xl">Rp.200.000</span>
              <span className="text-3xl md:text-4xl font-bold text-primary">Rp.99.000</span>
            </div>
            
            <a 
              href="https://t.me/+s22nBUElvnw0Y2Y1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-[#4863A0] font-bold py-4 px-10 rounded-xl transition-colors inline-block text-center text-lg md:text-xl"
            >
              Beli Sekarang
            </a>
          </div>

          {/* Image Carousel - Larger */}
          <div className="lg:w-1/2 w-full relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {images.map((img, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 relative h-80 md:h-96 lg:h-[28rem] rounded-xl overflow-hidden shadow-xl">
                    <Image
                      src={img}
                      alt={`Ebook Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-10 hover:bg-black/90 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white p-3 rounded-full z-10 hover:bg-black/90 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
            
            <div className="flex justify-center mt-6 space-x-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => emblaApi?.scrollTo(index)}
                  className={`w-3 h-3 rounded-full ${emblaApi?.selectedScrollSnap() === index ? 'bg-primary' : 'bg-gray-400'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated icons with className prop
const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);