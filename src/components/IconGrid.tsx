// // src/components/IconGrid.tsx
// 'use client';

// import React from 'react';
// import Image from 'next/image';

// type IconGridProps = {
//   count: number;
//   iconType: 'tree' | 'grass';
//   maxIcons?: number;
//   compact?: boolean;
// };

// const IconGrid: React.FC<IconGridProps> = ({
//   count,
//   iconType,
//   maxIcons = 20,
//   compact = false
// }) => {
//   // 値が正当かチェック
//   const safeCount = !isNaN(count) && count >= 0 ? Math.round(count) : 0;
  
//   // 表示するアイコンの数（最大数に制限）
//   const iconCount = Math.min(safeCount, maxIcons);
  
//   // アイコンのサイズ
//   const iconSize = compact ? 16 : 24;
//   const gridGap = compact ? 1 : 2;
  
//   // アイコンの配列を生成
//   const icons = Array.from({ length: iconCount }, (_, i) => (
//     <div key={i} className={`inline-block w-${iconSize / 4} h-${iconSize / 4}`}>
//       <Image
//         src={`/images/icons/${iconType}.svg`}
//         alt={iconType}
//         width={iconSize}
//         height={iconSize}
//         style={{ width: '100%', height: 'auto' }}
//       />
//     </div>
//   ));
  
//   return (
//     <div className={`flex flex-wrap gap-${gridGap} justify-center`}>
//       {icons}
//       {safeCount > maxIcons && (
//         <span className="text-xs text-gray-500">+{safeCount - maxIcons} more</span>
//       )}
//     </div>
//   );
// };

// export default IconGrid;




// src/components/IconGrid.tsx
'use client';

import React from 'react';
import Image from 'next/image';

type IconGridProps = {
  count: number;
  iconType: 'tree' | 'grass';
  maxIcons?: number;
  compact?: boolean;
};

const IconGrid: React.FC<IconGridProps> = ({
  count,
  iconType,
  maxIcons = 20,
  compact = false
}) => {
  // 有効な数値に変換
  const safeCount = !isNaN(count) && count >= 0 ? Math.round(count) : 0;
  
  // 表示するアイコンの数（最大数に制限）
  const iconCount = Math.min(safeCount, maxIcons);
  
  // アイコンのサイズ
  const iconSize = compact ? 20 : 24;
  
  // 表示レイアウト調整
  const columns = iconType === 'tree' ? 3 : 3;
  
  // アイコンの配列を生成
  const icons = Array.from({ length: iconCount }, (_, i) => (
    <div key={i} className={`inline-flex justify-center items-center w-${iconSize / 4} h-${iconSize / 4}`}>
      <Image
        src={`/images/icons/${iconType}.svg`}
        alt={iconType}
        width={iconSize}
        height={iconSize}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  ));
  
  return (
    <div className={`grid grid-cols-${columns} gap-1`}>
      {icons}
      {safeCount > maxIcons && (
        <div className="col-span-full text-xs text-center text-gray-500">
          +{safeCount - maxIcons} more
        </div>
      )}
    </div>
  );
};

export default IconGrid;