'use client';

import React from 'react';
import { CityData } from '../types';
import Image from 'next/image';

interface LayeredPieChartProps {
  cityData: CityData;
  size?: number;
}

const LayeredPieChart: React.FC<LayeredPieChartProps> = ({ cityData, size = 300 }) => {
  const {
    Name = 'Unknown City',
    GreenSpacePercentage = 0,
    GreenSpacePercentage_Trees = 0,
    GreenSpacePercentage_Grass = 0,
    VegetationHealth = 0,
    GreenSpaceDistribution = 0,
  } = cityData || {};

  // CSVデータを確認するためのデバッグログ
  console.log('City data:', cityData);

  // スケール背景画像用のインデックス計算
  const scaleIndex = Math.max(1, Math.min(10, Math.ceil(VegetationHealth * 10)));

  // SVG要素の中心座標を固定
  const center = 150;

  // 各レイヤーの半径を設定
  const radius1 = 50; // 内側の円 (緑地スペース)
  const radius2 = 80; // 中間の円 (植生の健康度)
  const radius3 = 120; // 外側の円 (分布)

  // 扇形のパスを生成する関数 (シンプルな実装)
  const createArcPath = (percentage: number, radius: number): string => {
    // 値が0またはNaNの場合は最小値として1%を使用
    const safePercentage = !percentage || isNaN(percentage) || percentage <= 0 ? 1 : percentage;

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
        <text
          x="10"
          y="290"
          fill="none"
          fontSize="8"
        >{`Debug: Dist=${GreenSpaceDistribution}, Veg=${VegetationHealth}, Trees=${GreenSpacePercentage_Trees}, Grass=${GreenSpacePercentage_Grass}`}</text>

        {/* レイヤー3 (最下層): Distribution of urban green space */}
        <path d={createArcPath(GreenSpaceDistribution || 5, radius3)} fill="#C1CCAC" opacity="0.7" />

        {/* レイヤー2 (中間層): Average health of urban vegetation */}
        <path d={createArcPath(VegetationHealth * 100, radius2)} fill="#DFC865" opacity="0.7" />

        {/* Trees (上部グリーン) */}
        <path d={createArcPath(GreenSpacePercentage_Trees, radius1)} fill="#4A7C59" opacity="0.7" />

        {/* Grass (上部ライトグリーン) */}
        <path
          d={createArcPath(GreenSpacePercentage_Grass, radius1)}
          fill="#A8C66C"
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