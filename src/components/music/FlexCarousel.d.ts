// Tipos de TypeScript para el componente FlexCarousel (escrito en JavaScript).

import type { CSSProperties, FC } from "react";

export interface FlexCarouselItem {
  src: string;
  alt?: string;
  title?: string;
  subtitle?: string;
}

export interface FlexCarouselProps {
  items?: FlexCarouselItem[];
  preset?: "liquid" | "ribbon" | "vortex" | "arch";
  intro?: "rise" | "bloom" | "spin" | "deal" | "none";
  fit?: "natural" | "portrait" | "square" | "landscape";
  cardHeight?: number;
  gap?: number;
  radius?: number;
  lensWidth?: number;
  lensHeight?: number;
  tilt?: number;
  roundness?: number;
  bend?: number;
  reach?: number;
  curl?: "twist" | "rise" | "fall";
  dispersion?: number;
  liquid?: number;
  followCursor?: boolean;
  squeeze?: number;
  focusOnClick?: boolean;
  autoplay?: boolean;
  interval?: number;
  captions?: boolean;
  captureWheel?: boolean;
  onChange?: (index: number, item: FlexCarouselItem) => void;
  onSelect?: (index: number, item: FlexCarouselItem) => void;
  /** Added for this site: fires when a card opens (focus) or closes. */
  onFocusChange?: (open: boolean, index: number, item: FlexCarouselItem | undefined) => void;
  /** Added for this site: accessible name of the carousel region. */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

declare const FlexCarousel: FC<FlexCarouselProps>;
export default FlexCarousel;
