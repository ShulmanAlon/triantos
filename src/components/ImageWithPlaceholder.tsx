import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  blurSrc?: string;
  className?: string;
};

export const ImageWithPlaceholder = ({
  src,
  alt,
  blurSrc,
  className = '',
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const showBlur = blurSrc && src.startsWith('/images');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showBlur && !loaded && (
        <img
          src={blurSrc}
          alt="blur placeholder"
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
        />
      )}
      {!showBlur && !loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover rounded transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
