'use client';
import React from 'react';
import Image from 'next/image';

// 3 gambar kartu ilustrasi yang akan dirotasi secara bergantian
const CARD_IMAGES = [
  '/auth-card-1.png', // PDF signed document
  '/auth-card-2.png', // Contract with checkmarks
  '/auth-card-3.png', // Image with crop handles
];

const AuthBackground = () => {
  // 5 variasi pola masonry (vertikal).
  // 1 = Kartu standar (tinggi 300px)
  // 2 = Kartu 2x lipat memanjang vertikal (tinggi 460px)
  const patterns = [
    [1, 2, 1, 1, 2, 1, 1, 1, 2],
    [2, 1, 1, 2, 2, 1, 1, 2],
    [1, 1, 2, 2, 1, 2, 1, 1, 1],
    [2, 2, 1, 1, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 1, 1, 1],
  ];

  const Card = ({ type, imageIndex }) => (
    <div
      className={`w-[220px] shrink-0 rounded-[1.5rem] overflow-hidden relative ${type === 2 ? 'h-[460px]' : 'h-[300px]'}`}
    >
      {/* Card illustration image */}
      <Image
        src={CARD_IMAGES[imageIndex % CARD_IMAGES.length]}
        alt=""
        fill
        className="object-cover"
        sizes="220px"
        loading="lazy"
      />

      {/* Subtle inner border for depth */}
      <div className="absolute inset-0 rounded-[1.5rem] border border-white/20 shadow-[inset_0_0_15px_rgba(0,0,0,0.15)]" />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes scroll-skewed-down {
          0% { transform: translateY(calc(-50% - 12px)); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-grid-down {
          animation: scroll-skewed-down 40s linear infinite;
        }
      `}</style>

      {/* Fixed background layer */}
      <div className="fixed inset-0 z-[-1] bg-[#0a0a0a] overflow-hidden pointer-events-none select-none">

        {/* Rotated wrapper to create the skewed layout */}
        <div
          className="absolute flex gap-4"
          style={{
            transform: 'rotate(-12deg) scale(1.6)',
            width: '200vw',
            height: '200vh',
            left: '-50vw',
            top: '-50vh',
            justifyContent: 'center',
          }}
        >
          {/* Create 15 columns for true vertical masonry */}
          {Array.from({ length: 15 }).map((_, colIndex) => {
            const pattern = patterns[colIndex % patterns.length];
            // Counter untuk melacak indeks gambar secara global di setiap kolom
            let imgCounter = colIndex;
            return (
              <div
                key={colIndex}
                className="flex flex-col gap-4 animate-scroll-grid-down"
              >
                {/* Block 1 */}
                {pattern.map((type, i) => {
                  const idx = imgCounter++;
                  return <Card key={`first-${i}`} type={type} imageIndex={idx} />;
                })}

                {/* Block 2 (Duplicate for seamless loop) */}
                {pattern.map((type, i) => {
                  const idx = imgCounter++;
                  return <Card key={`second-${i}`} type={type} imageIndex={idx} />;
                })}
              </div>
            );
          })}
        </div>

        {/* Dark overlay vignette to ensure the form stands out */}
        <div className="absolute inset-0 bg-black/20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      </div>
    </>
  );
};

export default AuthBackground;
