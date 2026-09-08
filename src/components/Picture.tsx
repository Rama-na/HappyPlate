import type { ImageAsset } from '../assets/images';

interface PictureProps {
  image: ImageAsset;
  sizes: string;
  className?: string;
  /** the hero is above the fold; everything else waits */
  priority?: boolean;
  alt?: string;
}

/** WebP with a JPEG fallback, intrinsic dimensions set to avoid layout shift. */
export function Picture({ image, sizes, className, priority = false, alt }: PictureProps) {
  return (
    <picture>
      <source type="image/webp" srcSet={image.webp} sizes={sizes} />
      <source type="image/jpeg" srcSet={image.jpg} sizes={sizes} />
      <img
        src={image.src}
        width={image.width}
        height={image.height}
        alt={alt ?? image.alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </picture>
  );
}
