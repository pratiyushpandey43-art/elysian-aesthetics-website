import Image from "next/image";

type ScreenshotCropProps = {
  src: string;
  alt: string;
  sourceWidth: number;
  sourceHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  priority?: boolean;
  className?: string;
};

/**
 * Displays a responsive, lossless crop from one of the user-supplied reference
 * screenshots. The source remains intact; the crop is performed by the
 * overflow-hidden media frame so every card stays sharp at any viewport size.
 */
export default function ScreenshotCrop({
  src,
  alt,
  sourceWidth,
  sourceHeight,
  cropX,
  cropY,
  cropWidth,
  priority = false,
  className = "",
}: ScreenshotCropProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={sourceWidth}
        height={sourceHeight}
        priority={priority}
        unoptimized
        draggable={false}
        className="absolute left-0 top-0 h-auto max-w-none select-none"
        style={{
          width: `${(sourceWidth / cropWidth) * 100}%`,
          transform: `translate(${-((cropX / sourceWidth) * 100)}%, ${-((cropY / sourceHeight) * 100)}%)`,
        }}
      />
    </div>
  );
}
