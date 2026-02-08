declare module 'embla-carousel-react' {
  import EmblaCarouselType from 'embla-carousel'
  export function useEmblaCarousel(
    options?: EmblaCarouselType.Options,
    plugins?: EmblaCarouselType.Plugin[]
  ): [React.RefObject<HTMLDivElement>, EmblaCarouselType.EmblaCarousel]
}

declare module 'embla-carousel-autoplay' {
  import EmblaCarouselType from 'embla-carousel'
  export default function Autoplay(options?: {
    delay?: number
    stopOnInteraction?: boolean
    playOnInit?: boolean
  }): EmblaCarouselType.Plugin
}