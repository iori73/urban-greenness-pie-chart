// // src/components/SimpleLayeredPieChart.tsx
// 'use client';

// import React from 'react';
// import { CityData } from '../types';
// import Image from 'next/image';

// type LayeredPieChartProps = {
//   cityData: CityData;
//   size?: number;
// };

// const SimpleLayeredPieChart: React.FC<LayeredPieChartProps> = ({ cityData, size = 300 }) => {
//   const {
//     Name = 'Unknown City',
//     GreenSpacePercentage = 0,
//     GreenSpacePercentage_Trees = 0,
//     GreenSpacePercentage_Grass = 0,
//     VegetationHealth = 0,
//     GreenSpaceDistribution = 0
//   } = cityData || {};

//   // スケール背景画像用のインデックス計算
//   const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));

//   // 円弧を描画するためのヘルパー関数
//   const createArc = (value: number, maxValue: number, radius: number) => {
//     // 値が0の場合は描画しない
//     if (value <= 0) return null;

//     // 値をパーセンテージに変換（0-1の範囲）
//     const percentage = Math.min(value, maxValue) / maxValue;

//     // 円弧の角度（ラジアン）
//     const angle = percentage * 2 * Math.PI;

//     // 円弧の終点座標
//     const endX = 150 + radius * Math.sin(angle);
//     const endY = 150 - radius * Math.cos(angle);

//     // 円弧のフラグ（大きい弧かどうか）
//     const largeArcFlag = percentage > 0.5 ? 1 : 0;

//     // SVGパスを生成
//     return (
//       <path
//         d={`M 150 150 L 150 ${150 - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
//         style={{ transition: 'all 0.3s ease' }}
//       />
//     );
//   };

//   return (
//     <div className="relative">
//       {/* 背景画像 */}
//       <div className="absolute inset-0 opacity-5">
//         <Image
//           src={`/images/scales/scale-${scaleIndex}.png`}
//           alt={`Vegetation Health Scale ${scaleIndex}`}
//           width={size}
//           height={size}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             const target = e.target as HTMLImageElement;
//             target.style.display = 'none';
//           }}
//         />
//       </div>

//       <svg width={size} height={size} viewBox="0 0 300 300" className="mx-auto">
//         {/* 3. Distribution of urban green space (最大半径) */}
//         <g fill="#C1CCAC" opacity="0.7">
//           {createArc(GreenSpaceDistribution || 5, 100, 250)}
//         </g>

//         {/* 2. Average health of urban vegetation (中間半径) */}
//         <g fill="#DFC865" opacity="0.7">
//           {createArc(VegetationHealth * 100, 100, 150)}
//         </g>

//         {/* 1. Trees (最小半径) */}
//         <g fill="#196000" opacity="0.7">
//           {createArc(GreenSpacePercentage_Trees, 100, 50)}
//         </g>

//         {/* 1. Grass (最小半径、Treesの後に表示) */}
//         <g fill="#30B901" opacity="0.7">
//           <g transform={`rotate(${GreenSpacePercentage_Trees * 3.6}, 150, 150)`}>
//             {createArc(GreenSpacePercentage_Grass, 100, 50)}
//           </g>
//         </g>
//       </svg>

//       {/* 都市名と緑地データ */}
//       <div className="mt-4 text-center">
//         <h2 className="text-2xl font-bold mb-2">{Name}</h2>
//         <p className="text-lg">Green Space: {GreenSpacePercentage}%</p>
//       </div>

//       {/* データ詳細 */}
//       <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
//         <div>
//           <p>Trees: {GreenSpacePercentage_Trees}%</p>
//           <p>Grass: {GreenSpacePercentage_Grass}%</p>
//         </div>
//         <div>
//           <p>Distribution: {GreenSpaceDistribution}%</p>
//           <p>Vegetation Health: {(VegetationHealth * 100).toFixed(0)}%</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimpleLayeredPieChart;

// src/components/SimpleLayeredPieChart.tsx
'use client';

import React from 'react';
import { CityData } from '../types';
import Image from 'next/image';

type LayeredPieChartProps = {
  cityData: CityData;
  size?: number;
};

const SimpleLayeredPieChart: React.FC<LayeredPieChartProps> = ({ cityData, size = 300 }) => {
  const {
    Name = 'Unknown City',
    GreenSpacePercentage = 0,
    GreenSpacePercentage_Trees = 0,
    GreenSpacePercentage_Grass = 0,
    VegetationHealth = 0,
    GreenSpaceDistribution = 0,
  } = cityData || {};

  // スケール背景画像用のインデックス計算
  const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));

  // 各円グラフの半径を設定（直径の半分）
  const radius1 = 50; // Percentage of urban green space (直径100px)
  const radius2 = 100; // Average health of urban vegetation (直径200px)
  const radius3 = 150; // Distribution of urban green space (直径300px)

  // 円弧を描画するためのヘルパー関数
  const createArc = (value: number, maxValue: number, radius: number, fill: string) => {
    // 値が0の場合は描画しない
    if (value <= 0) return null;

    // 値をパーセンテージに変換（0-1の範囲）
    const percentage = Math.min(value, maxValue) / maxValue;

    // 円弧の角度（ラジアン）
    const angle = percentage * 2 * Math.PI;

    // 円弧の終点座標
    const endX = 150 + radius * Math.sin(angle);
    const endY = 150 - radius * Math.cos(angle);

    // 円弧のフラグ（大きい弧かどうか）
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    // SVGパスを生成
    return (
      <path
        d={`M 150 150 L 150 ${150 - radius} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
        fill={fill}
        opacity="0.7"
        style={{ transition: 'all 0.3s ease' }}
      />
    );
  };

  // 一意的なIDを生成（SVGパターン用）
  const patternId = `health-pattern-${scaleIndex}`;

  return (
    <div className="relative">
      {/* 背景画像 */}
      {/* <div className="absolute inset-0 opacity-5">
        <Image
          src={`/images/scales/scale-${scaleIndex}.png`}
          alt={`Vegetation Health Scale ${scaleIndex}`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div> */}

      <svg width={size} height={size} viewBox="0 0 300 300" className="mx-auto">
        {/* SVGパターン定義 */}
        <defs>
          <pattern id={patternId} patternUnits="userSpaceOnUse" width="300" height="300">
            <image href={`/images/scales/scale-${scaleIndex}.png`} x="0" y="0" width="300" height="300" opacity={0.5} />
          </pattern>
        </defs>

        {/* 3. Distribution of urban green space (半径150px) */}
        {createArc(GreenSpaceDistribution || 5, 100, radius3, '#C1CCAC')}

        {/* 2. Average health of urban vegetation (半径100px) - 画像パターンで塗りつぶし */}
        {createArc(VegetationHealth * 100, 100, radius2, `url(#${patternId})`)}

        {/* 1. Trees (半径50px) */}
        {createArc(GreenSpacePercentage_Trees, 100, radius1, '#196000')}

        {/* 1. Grass (半径50px、Treesの後に表示) */}
        <g transform={`rotate(${GreenSpacePercentage_Trees * 3.6}, 150, 150)`}>
          {createArc(GreenSpacePercentage_Grass, 100, radius1, '#30B901')}
        </g>
      </svg>

      {/* 都市名と緑地データ */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold mb-2">{Name}</h2>
        <p className="text-lg">Green Space: {GreenSpacePercentage}%</p>
      </div>

      {/* データ詳細 */}
      <div className="mt-6 space-y-4">
        {/* Trees Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#196000]" />
            <span className="text-sm font-medium">Trees</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#196000] rounded-full transition-all duration-300"
                style={{ width: `${GreenSpacePercentage_Trees}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">{GreenSpacePercentage_Trees}%</span>
          </div>
        </div>

        {/* Grass Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#30B901]" />
            <span className="text-sm font-medium">Grass</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#30B901] rounded-full transition-all duration-300"
                style={{ width: `${GreenSpacePercentage_Grass}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">{GreenSpacePercentage_Grass}%</span>
          </div>
        </div>

        {/* Distribution Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#C1CCAC]" />
            <span className="text-sm font-medium">Distribution</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C1CCAC] rounded-full transition-all duration-300"
                style={{ width: `${GreenSpaceDistribution}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">{GreenSpaceDistribution}%</span>
          </div>
        </div>

        {/* Vegetation Health Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#DFC865]" />
            <span className="text-sm font-medium">Vegetation Health</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#DFC865] rounded-full transition-all duration-300"
                style={{ width: `${VegetationHealth * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium w-12 text-right">{(VegetationHealth * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLayeredPieChart;
