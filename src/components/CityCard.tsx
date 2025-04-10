// // src/components/CityCard.tsx
// 'use client';

// import React from 'react';
// import { CityData } from '../types';
// import PieChart from './PieChart';
// import IconGrid from './IconGrid';
// import Image from 'next/image';

// type CityCardProps = {
//   cityData: CityData;
// };

// const CityCard: React.FC<CityCardProps> = ({ cityData }) => {
//   // データの安全なアクセス
//   const {
//     Name = 'Unknown City',
//     GreenSpacePercentage = 0,
//     GreenSpacePercentage_Trees = 0,
//     GreenSpacePercentage_Grass = 0,
//     VegetationHealth = 0,
//     GreenSpaceDistribution = 0
//   } = cityData || {};

//   // 0～1の値を1～10のスケールに変換（切り上げ）
//   const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));

//   return (
//     <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="relative">
//         {/* スケール背景画像 */}
//         <div className="absolute inset-0 z-0 opacity-10">
//           <Image
//             src={`/images/scales/scale-${scaleIndex}.png`}
//             alt={`Scale level ${scaleIndex}`}
//             width={400}
//             height={300}
//             className="w-full h-full object-cover"
//           />
//         </div>
        
//         <div className="relative z-10 p-6">
//           {/* 都市名 */}
//           <h2 className="text-xl font-bold mb-4 text-center">{Name}</h2>
          
//           {/* 緑地スペース全体 */}
//           <div className="mb-5">
//             <p className="text-center font-semibold mb-2">Green Space: {GreenSpacePercentage}%</p>
//             <div className="flex justify-center">
//               <PieChart 
//                 percentage={GreenSpacePercentage} 
//                 color="rgba(104, 159, 56, 0.5)"
//                 size={80}
//                 arcOnly={true}
//               />
//             </div>
//           </div>
          
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {/* 樹木 */}
//             <div>
//               <p className="text-center text-sm mb-1">Trees: {GreenSpacePercentage_Trees}%</p>
//               <div className="flex justify-center mb-2">
//                 <PieChart 
//                   percentage={GreenSpacePercentage_Trees} 
//                   color="rgba(25, 96, 0, 0.5)" 
//                   size={60}
//                   arcOnly={true}
//                 />
//               </div>
//               <IconGrid 
//                 count={GreenSpacePercentage_Trees} 
//                 iconType="tree" 
//                 maxIcons={20}
//                 compact={true}
//               />
//             </div>
            
//             {/* 草地 */}
//             <div>
//               <p className="text-center text-sm mb-1">Grass: {GreenSpacePercentage_Grass}%</p>
//               <div className="flex justify-center mb-2">
//                 <PieChart 
//                   percentage={GreenSpacePercentage_Grass} 
//                   color="rgba(76, 175, 80, 0.5)" 
//                   size={60}
//                   arcOnly={true}
//                 />
//               </div>
//               <IconGrid 
//                 count={GreenSpacePercentage_Grass} 
//                 iconType="grass" 
//                 maxIcons={12}
//                 compact={true}
//               />
//             </div>
            
//             {/* 分布 */}
//             <div>
//               <p className="text-center text-sm mb-1">Distribution: {GreenSpaceDistribution}%</p>
//               <div className="flex justify-center mb-2">
//                 <PieChart 
//                   percentage={GreenSpaceDistribution} 
//                   color="rgba(193, 204, 172, 0.5)" 
//                   size={60}
//                   arcOnly={true}
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* 植生の健康状態 */}
//           <div>
//             <p className="text-center text-sm mb-1">Vegetation Health: {(VegetationHealth * 100).toFixed(0)}%</p>
//             <div className="flex justify-center">
//               <PieChart 
//                 percentage={VegetationHealth * 100} 
//                 color="rgba(223, 200, 101, 0.5)"
//                 size={80} 
//                 arcOnly={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CityCard;



// src/components/CityCard.tsx
'use client';

import React from 'react';
import { CityData } from '../types';
import PieChart from './PieChart';
import IconGrid from './IconGrid';
import Image from 'next/image';

type CityCardProps = {
  cityData: CityData;
};

const CityCard: React.FC<CityCardProps> = ({ cityData }) => {
  const {
    Name = 'Unknown City',
    GreenSpacePercentage = 0,
    GreenSpacePercentage_Trees = 0,
    GreenSpacePercentage_Grass = 0,
    VegetationHealth = 0,
    GreenSpaceDistribution = 0
  } = cityData || {};

  const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-full">
        {/* 背景画像 - 不透明度を下げて薄く表示 */}
        <div className="absolute inset-0 z-0 opacity-5">
          <Image
            src={`/images/scales/scale-${scaleIndex}.png`}
            alt={`Scale level ${scaleIndex}`}
            width={400}
            height={300}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.style.backgroundColor = `rgba(240, 240, 220, 0.5)`;
            }}
          />
        </div>
        
        <div className="relative z-10 p-8">
          {/* 都市名 */}
          <h2 className="text-2xl font-bold mb-6 text-center">{Name}</h2>
          
          {/* 緑地スペース全体 */}
          <div className="mb-6">
            <p className="text-lg font-medium mb-2">Green Space: {GreenSpacePercentage}%</p>
            <div className="flex items-center">
              <PieChart 
                percentage={GreenSpacePercentage} 
                color="rgba(104, 159, 56, 0.7)"
                size={70}
                arcOnly={true}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-6">
            {/* 樹木 */}
            <div>
              <p className="text-sm mb-1">Trees: {GreenSpacePercentage_Trees}%</p>
              <div className="mb-2">
                <PieChart 
                  percentage={GreenSpacePercentage_Trees} 
                  color="rgba(25, 96, 0, 0.7)" 
                  size={50}
                  arcOnly={true}
                />
              </div>
              <IconGrid 
                count={GreenSpacePercentage_Trees} 
                iconType="tree" 
                maxIcons={20}
                compact={true}
              />
            </div>
            
            {/* 草地 */}
            <div>
              <p className="text-sm mb-1">Grass: {GreenSpacePercentage_Grass}%</p>
              <div className="mb-2">
                <PieChart 
                  percentage={GreenSpacePercentage_Grass} 
                  color="rgba(76, 175, 80, 0.7)" 
                  size={50}
                  arcOnly={true}
                />
              </div>
              <IconGrid 
                count={GreenSpacePercentage_Grass} 
                iconType="grass" 
                maxIcons={12}
                compact={true}
              />
            </div>
            
            {/* 分布 */}
            <div>
              <p className="text-sm mb-1">Distribution: {GreenSpaceDistribution}%</p>
              <div className="mb-2">
                <PieChart 
                  percentage={GreenSpaceDistribution} 
                  color="rgba(193, 204, 172, 0.7)" 
                  size={50}
                  arcOnly={true}
                />
              </div>
            </div>
          </div>
          
          {/* 植生の健康状態 */}
          <div className="mt-auto">
            <p className="text-sm mb-1">Vegetation Health: {(VegetationHealth * 100).toFixed(0)}%</p>
            <div className="flex items-center">
              <PieChart 
                percentage={VegetationHealth * 100} 
                color="rgba(223, 200, 101, 0.7)"
                size={70} 
                arcOnly={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;