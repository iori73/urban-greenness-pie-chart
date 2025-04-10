// src/components/ScaleBackground.tsx
'use client';

import React from 'react';
import Image from 'next/image';

type ScaleBackgroundProps = {
  value: number; // 0～1の値
  children: React.ReactNode;
};

const ScaleBackground: React.FC<ScaleBackgroundProps> = ({ value, children }) => {
  // 値が正当かチェック、無効なら1にデフォルト
  const safeValue = !isNaN(value) && value >= 0 && value <= 1 ? value : 0.1;
  
  // 0～1の値を1～10のスケールに変換（切り上げ）
  const scaleIndex = Math.max(1, Math.min(10, Math.ceil(safeValue * 10)));
  
  return (
    <div className="relative">
      {/* 背景画像 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={`/images/scales/scale-${scaleIndex}.png`}
          alt={`Scale level ${scaleIndex}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* 子要素を上に表示 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ScaleBackground;