// // src/components/LayeredPieChart.tsx の修正版

// 'use client';

// import React from 'react';
// import { CityData } from '../types';
// import Image from 'next/image';

// type LayeredPieChartProps = {
//   cityData: CityData;
//   size?: number;
// };

// const LayeredPieChart: React.FC<LayeredPieChartProps> = ({ cityData, size = 300 }) => {
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
  
//   // 中心座標
//   const center = size / 2;
  
//   // 各レイヤーのサイズを指定された値に基づいて計算
//   // サイズは直径なので、半径に変換する必要があります
//   const radius1 = 100 / 2; // Percentage of urban green space
//   const radius2 = 300 / 2; // Average health of urban vegetation
//   const radius3 = 500 / 2; // Distribution of urban green space

//   // 扇形のパスを生成する関数
//   const createArcPath = (startAngle: number, endAngle: number, radius: number): string => {
//     // 角度をラジアンに変換
//     const startRad = (startAngle - 90) * Math.PI / 180;
//     const endRad = (endAngle - 90) * Math.PI / 180;
    
//     // 円弧の終点座標
//     const x1 = center + radius * Math.cos(startRad);
//     const y1 = center + radius * Math.sin(startRad);
//     const x2 = center + radius * Math.cos(endRad);
//     const y2 = center + radius * Math.sin(endRad);
    
//     // 大円弧フラグ（180度以上の場合は1、そうでなければ0）
//     const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
//     // SVGのパス文字列を生成
//     return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
//   };

//   // 角度の計算（0-100%を0-360度に変換）
//   const treesEndAngle = 360 * (GreenSpacePercentage_Trees / 100);
//   const grassEndAngle = 360 * (GreenSpacePercentage_Grass / 100);
//   const vegetationHealthEndAngle = 360 * VegetationHealth;
//   const distributionEndAngle = 360 * (GreenSpaceDistribution / 100);

//   // viewBoxのサイズ計算（最大の円グラフに基づく）
//   const maxRadius = Math.max(radius1, radius2, radius3);
//   const viewBoxSize = maxRadius * 2 + 40; // 若干の余白を追加

//   return (
//     <div className="relative">
//       {/* 背景画像 - VegetationHealth値に基づく */}
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

//       <svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="mx-auto">
//         {/* レイヤー3 (最下層): Distribution of urban green space */}
//         <path
//           d={createArcPath(0, distributionEndAngle, radius3)}
//           fill="#C1CCAC"
//           opacity="0.7"
//         />
        
//         {/* レイヤー2 (中間層): Average health of urban vegetation */}
//         <path
//           d={createArcPath(0, vegetationHealthEndAngle, radius2)}
//           fill="#DFC865"
//           opacity="0.7"
//         />
        
//         {/* レイヤー1 (最上層): Percentage of urban green space - Trees */}
//         <path
//           d={createArcPath(0, treesEndAngle, radius1)}
//           fill="#196000"
//           opacity="0.7"
//         />
        
//         {/* レイヤー1 (最上層): Percentage of urban green space - Grass */}
//         <path
//           d={createArcPath(treesEndAngle, treesEndAngle + grassEndAngle, radius1)}
//           fill="#30B901"
//           opacity="0.7"
//         />
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

// export default LayeredPieChart;


// src/components/LayeredPieChart.tsx
'use client';

import React from 'react';
import { CityData } from '../types';
import Image from 'next/image';

import SimpleLayeredPieChart from 'SimpleLayeredPieChart'; // 新しいコンポーネント


type LayeredPieChartProps = {
  cityData: CityData;
  size?: number;
};

const LayeredPieChart: React.FC<LayeredPieChartProps> = ({ cityData, size = 300 }) => {
  const {
    Name = 'Unknown City',
    GreenSpacePercentage = 0,
    GreenSpacePercentage_Trees = 0,
    GreenSpacePercentage_Grass = 0,
    VegetationHealth = 0,
    GreenSpaceDistribution = 0
  } = cityData || {};

  // CSVデータを確認するためのデバッグログ
  console.log("City data:", cityData);
  
  // スケール背景画像用のインデックス計算
  const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));
  
  // SVG要素の中心座標を固定
  const center = 150;
  
  // 各レイヤーの半径を設定
  const radius1 = 50;  // Percentage of urban green space (100px径)
  const radius2 = 150; // Average health of urban vegetation (300px径)
  const radius3 = 250; // Distribution of urban green space (500px径)

  // 扇形のパスを生成する関数 (シンプルな実装)
  const createArcPath = (percentage: number, radius: number): string => {
    // 値が0またはNaNの場合は最小値として1%を使用
    const safePercentage = (!percentage || isNaN(percentage) || percentage <= 0) ? 1 : percentage;
    
    if (safePercentage >= 100) {
      // 完全な円の場合
      return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.001} ${center - radius} Z`;
    }
    
    // 0-100%を0-360度に変換し、ラジアンに変換
    const endAngle = safePercentage * 0.01 * 2 * Math.PI;
    
    // SVGで使用する座標を計算
    const startX = center;
    const startY = center - radius;
    const endX = center + radius * Math.sin(endAngle);
    const endY = center - radius * Math.cos(endAngle);
    
    // 大円弧フラグ（180度以上の場合は1、そうでなければ0）
    const largeArcFlag = safePercentage > 50 ? 1 : 0;
    
    // SVGのパス文字列を生成
    return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  return (
    <div className="relative">
      {/* 背景画像 - VegetationHealth値に基づく */}
      <div className="absolute inset-0 opacity-5">
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
      </div>

      {/* SVGコンテナのサイズを固定し、viewBoxも調整 */}
      <svg width={size} height={size} viewBox="0 0 300 300" className="mx-auto">
        {/* コンソールにデバッグ情報を出力 */}
        <text x="10" y="290" fill="none" fontSize="8">{`Debug: Dist=${GreenSpaceDistribution}, Veg=${VegetationHealth}, Trees=${GreenSpacePercentage_Trees}, Grass=${GreenSpacePercentage_Grass}`}</text>
        
        {/* レイヤー3 (最下層): Distribution of urban green space */}
        <path
          d={createArcPath(GreenSpaceDistribution || 5, radius3)}
          fill="#C1CCAC"
          opacity="0.7"
        />
        
        {/* レイヤー2 (中間層): Average health of urban vegetation */}
        <path
          d={createArcPath(VegetationHealth * 100, radius2)}
          fill="#DFC865"
          opacity="0.7"
        />
        
        {/* Trees (上部グリーン) */}
        <path
          d={createArcPath(GreenSpacePercentage_Trees, radius1)}
          fill="#196000"
          opacity="0.7"
        />
        
        {/* Grass (上部ライトグリーン) */}
        <path
          d={createArcPath(GreenSpacePercentage_Grass, radius1)}
          fill="#30B901"
          opacity="0.7"
          transform={`rotate(${GreenSpacePercentage_Trees * 3.6}, ${center}, ${center})`}
        />
      </svg>
      
      {/* 都市名と緑地データ */}
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold mb-2">{Name}</h2>
        <p className="text-lg">Green Space: {GreenSpacePercentage}%</p>
      </div>
      
      {/* データ詳細 */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p>Trees: {GreenSpacePercentage_Trees}%</p>
          <p>Grass: {GreenSpacePercentage_Grass}%</p>
        </div>
        <div>
          <p>Distribution: {GreenSpaceDistribution}%</p>
          <p>Vegetation Health: {(VegetationHealth * 100).toFixed(0)}%</p>
        </div>
      </div>
    </div>
  );
};

export default LayeredPieChart;