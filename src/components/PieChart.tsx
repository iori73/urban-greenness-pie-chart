// // src/components/PieChart.tsx
// 'use client';

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';

// type PieChartProps = {
//   percentage: number;
//   color: string;
//   size?: number;
//   strokeWidth?: number;
//   arcOnly?: boolean; // 扇形のみ描画するかどうか
// };

// const PieChart: React.FC<PieChartProps> = ({
//   percentage,
//   color,
//   size = 100,
//   strokeWidth = 10,
//   arcOnly = false
// }) => {
//   const svgRef = useRef<SVGSVGElement>(null);
  
//   useEffect(() => {
//     if (!svgRef.current) return;
    
//     // SVG要素をクリア
//     d3.select(svgRef.current).selectAll('*').remove();
    
//     const svg = d3.select(svgRef.current);
//     const radius = size / 2;
    
//     // NaNエラーを防ぐためのガード
//     const validPercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    
//     if (arcOnly) {
//       // 扇形の円弧を描画（円グラフの一部のように）
//       const arc = d3.arc()
//         .innerRadius(0)
//         .outerRadius(radius)
//         .startAngle(-Math.PI / 2) // -90度から開始
//         .endAngle((-Math.PI / 2) + (2 * Math.PI * validPercentage / 100)); // 指定された割合
      
//       svg.append('path')
//         .attr('d', arc as any)
//         .attr('transform', `translate(${radius}, ${radius})`)
//         .attr('fill', color);
//     } else {
//       // 円形のトラックと進捗を描画
//       const innerRadius = radius - strokeWidth;
      
//       // 背景円（トラック）
//       const backgroundArc = d3.arc()
//         .innerRadius(innerRadius)
//         .outerRadius(radius)
//         .startAngle(0)
//         .endAngle(2 * Math.PI);
      
//       svg.append('path')
//         .attr('d', backgroundArc as any)
//         .attr('transform', `translate(${radius}, ${radius})`)
//         .attr('fill', 'rgba(200, 200, 200, 0.2)');
      
//       // 進捗円弧
//       const progressArc = d3.arc()
//         .innerRadius(innerRadius)
//         .outerRadius(radius)
//         .startAngle(0)
//         .endAngle((2 * Math.PI * validPercentage) / 100);
      
//       svg.append('path')
//         .attr('d', progressArc as any)
//         .attr('transform', `translate(${radius}, ${radius})`)
//         .attr('fill', color);
//     }
//   }, [percentage, color, size, strokeWidth, arcOnly]);
  
//   return (
//     <svg 
//       ref={svgRef} 
//       width={size} 
//       height={size} 
//       viewBox={`0 0 ${size} ${size}`}
//       className="overflow-visible" // SVGの内容がはみ出ても表示
//     >
//       {/* D3.jsによって動的に描画 */}
//     </svg>
//   );
// };

// export default PieChart;



// src/components/PieChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

type PieChartProps = {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  arcOnly?: boolean;
};

const PieChart: React.FC<PieChartProps> = ({
  percentage,
  color,
  size = 100,
  strokeWidth = 0,
  arcOnly = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // SVG要素をクリア
    d3.select(svgRef.current).selectAll('*').remove();
    
    const svg = d3.select(svgRef.current);
    const radius = size / 2;
    
    // 有効な割合値（0-100の範囲に収める）
    const validPercentage = isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
    
    // 扇形の円弧を描画
    const arc = d3.arc()
      .innerRadius(strokeWidth)  // 中心からの空白
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)  // -90度から開始
      .endAngle((-Math.PI / 2) + (2 * Math.PI * validPercentage / 100));
    
    svg.append('path')
      .attr('d', arc as any)
      .attr('transform', `translate(${radius}, ${radius})`)
      .attr('fill', color);
      
  }, [percentage, color, size, strokeWidth, arcOnly]);
  
  return (
    <svg 
      ref={svgRef} 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
    />
  );
};

export default PieChart;