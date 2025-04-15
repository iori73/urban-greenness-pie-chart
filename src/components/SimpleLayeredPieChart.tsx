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
  // Extract data from cityData with fallbacks
  const {
    Name = 'Unknown City',
    GreenSpacePercentage = 0,
    GreenSpacePercentage_Trees = 0,
    GreenSpacePercentage_Grass = 0,
    VegetationHealth = 0,
  } = cityData || {};

  // Calculate the width based on percentage values for progress bars
  const treeBarWidth = `${GreenSpacePercentage_Trees * 2.4}px`; // 240px is full width
  const grassBarWidth = `${GreenSpacePercentage_Grass * 2.4}px`;

  // Calculate scale index for vegetation health image (1-10)
  const scaleIndex = Math.max(1, Math.min(10, Math.round(VegetationHealth * 10)));

  // 中心座標を動的に計算
  const center = size / 2;

  // 各レイヤーの半径を表示サイズに応じて計算
  const radius1 = size / 6; // 内側の円 (緑地スペース)
  const radius2 = size / 3; // 中間の円 (植生の健康度)
  const radius3 = size / 2.4; // 外側の円 (分布)

  // Helper function to create arc for pie chart segments
  const createArc = (value: number, maxValue: number, radius: number, fill: string) => {
    // Skip if value is 0 or negative
    if (value <= 0) return null;

    // Convert value to percentage (0-1 range)
    const percentage = Math.min(value, maxValue) / maxValue;

    // Arc angle in radians
    const angle = percentage * 2 * Math.PI;

    // End coordinates of the arc
    const endX = center + radius * Math.sin(angle);
    const endY = center - radius * Math.cos(angle);

    // Arc flag (large arc or not)
    const largeArcFlag = percentage > 0.5 ? 1 : 0;

    // Generate SVG path
    return (
      <path
        d={`M ${center} ${center} L ${center} ${
          center - radius
        } A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
        fill={fill}
        stroke="#f5f9ef"
        strokeWidth="2"
        opacity="0.7"
        style={{ transition: 'all 0.3s ease' }}
      />
    );
  };

  // Function to create image sector for pie chart
  const createImageSector = (
    value: number,
    maxValue: number,
    radius: number,
    imageUrl: string,
    opacity: number = 1,
  ) => {
    // Skip if value is 0 or negative
    if (value <= 0) return null;

    // Convert value to percentage (0-1 range)
    const percentage = Math.min(value, maxValue) / maxValue;

    // Arc angle in radians
    const angle = percentage * 2 * Math.PI;

    // Generate unique ID for clip path
    const clipPathId = `clip-path-${imageUrl.replace(/[^a-zA-Z0-9]/g, '')}-${Math.round(percentage * 100)}`;

    // Approximate the sector with a polygon
    // Use many points for a smooth arc
    const numPoints = 60;
    const points = [];
    points.push([center, center]); // Center point

    // Starting point (top)
    points.push([center, center - radius]);

    // Place points along the arc
    for (let i = 1; i <= numPoints; i++) {
      const currentAngle = (i / numPoints) * angle;
      if (currentAngle <= angle) {
        const x = center + radius * Math.sin(currentAngle);
        const y = center - radius * Math.cos(currentAngle);
        points.push([x, y]);
      }
    }

    // Convert polygon points to string
    const polygonPoints = points.map((point) => point.join(',')).join(' ');

    return (
      <>
        <defs>
          <clipPath id={clipPathId}>
            <polygon points={polygonPoints} />
          </clipPath>
        </defs>
        <image
          href={imageUrl}
          x={center - radius}
          y={center - radius}
          width={radius * 2}
          height={radius * 2}
          clipPath={`url(#${clipPathId})`}
          opacity={opacity}
          style={{ objectFit: 'cover' }}
        />
      </>
    );
  };

  // ----
  // First, let's handle the data extraction properly
  const cityDataObj = cityData || {};
  let distributionValue = 0;

  // Try multiple ways to access the distribution data
  if ('GreenSpaceDistribution' in cityDataObj) {
    distributionValue = Number(cityDataObj.GreenSpaceDistribution);
  } else {
    // Look for property with similar name that might have whitespace issues
    const distributionKey = Object.keys(cityDataObj).find(
      (key) => key.includes('GreenSpaceDistribution') || key.replace(/\s+/g, '') === 'GreenSpaceDistribution',
    );

    if (distributionKey) {
      distributionValue = Number(cityDataObj[distributionKey]);
    }
  }

  console.log('Extracted distribution value:', distributionValue);

  return (
    <div className="w-full sm:w-auto bg-white rounded-2xl">
      <div className="w-full flex flex-col justify-start items-start gap-0 p-4">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="mx-auto"
          style={{ maxWidth: '250px', maxHeight: '250px' }}
        >
          {/* 3. Distribution of urban green space */}
          {createImageSector(distributionValue, 100, radius3, '/images/3-bg-map.png', 1)}

          {/* 2. Average health of urban vegetation */}
          {createImageSector(VegetationHealth * 100, 100, radius2, `/images/scales/scale-${scaleIndex}.png`, 0.5)}

          {/* 1. Trees */}
          {createArc(GreenSpacePercentage_Trees, 100, radius1, '#4A7C59')}

          {/* 1. Grass (Treesの後に表示) */}
          <g transform={`rotate(${GreenSpacePercentage_Trees * 3.6}, ${center}, ${center})`}>
            {createArc(GreenSpacePercentage_Grass, 100, radius1, '#A8C66C')}
          </g>
        </svg>
        <div className="w-full flex flex-col justify-start items-start gap-6">
          {/* City Name */}
          <div className="self-stretch text-center text-black text-3xl font-medium font-['Roboto']">{Name}</div>

          <div className="w-full flex flex-col justify-start items-start gap-6">
            {/* Green Space Percentage Card */}
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="self-stretch text-center text-black/50 text-lg font-normal font-['Roboto'] leading-tight">
                Percentage of urban green space
              </div>
              <div className="self-stretch p-4 bg-[#FAFAFA] rounded-xl flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-center gap-2">
                  <div className="text-center text-black text-[32px] font-medium font-['Roboto'] leading-10">
                    {GreenSpacePercentage}%
                  </div>
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="w-full h-4 relative bg-[#efeff4] rounded-[100px] overflow-hidden">
                      <div className="h-6 left-[-0.10px] top-[-3.50px] absolute inline-flex justify-start items-start">
                        <div className="h-full bg-[#4a7c59]" style={{ width: treeBarWidth }} />
                        <div className="h-full bg-[#a8c66c]" style={{ width: grassBarWidth }} />
                      </div>
                    </div>

                    <div className="gap-4 inline-flex justify-between items-center">
                      <div className="flex justify-start items-center gap-2">
                        <div className="flex justify-start items-center gap-1">
                          <svg
                            width="33"
                            height="32"
                            viewBox="0 0 33 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M32.7087 16.0009C32.7087 7.16706 25.5475 0.00585938 16.7137 0.00585938C7.87995 0.00585938 0.71875 7.16706 0.71875 16.0009C0.71875 24.8347 7.87995 31.9959 16.7137 31.9959C25.5475 31.9959 32.7087 24.8347 32.7087 16.0009Z"
                              fill="#4A7C59"
                              fillOpacity="0.1"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M21.7134 14.2729L24.4642 19.7746L24.702 20.2506C24.9885 20.8234 24.5721 21.497 23.9319 21.497H18.4358V26.6645H14.9911V21.497H9.49511C8.85492 21.497 8.43854 20.8234 8.72485 20.2506L15.9433 5.81395C16.2606 5.17921 17.1664 5.17921 17.4838 5.81395L21.7134 14.2729Z"
                              fill="#196000"
                            />
                          </svg>
                          {/* <Image src={`/images/icons/tree.svg`} alt="Tree Icon" width={20} height={20} /> */}

                          <div className="text-black text-base font-normal font-['Roboto'] leading-tight">Trees</div>
                        </div>
                        <div className="text-black text-2xl font-medium font-['Roboto'] leading-10">
                          {GreenSpacePercentage_Trees}%
                        </div>
                      </div>

                      <div className="flex justify-start items-center gap-1">
                        <div className="flex justify-start items-center gap-0.5">
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect width="32" height="32" rx="16" fill="#A8C66C" fillOpacity="0.1" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M13.6735 8.15416L13.6688 8.14736C13.6662 8.14408 13.664 8.14069 13.6618 8.13731L13.6569 8.13004C13.6229 8.09035 13.5808 8.0557 13.5289 8.03239C13.3536 7.95427 13.1437 8.02231 13.0595 8.18422C13.0208 8.25887 13.0167 8.33982 13.0391 8.41353C13.4795 10.1815 13.2829 11.3043 13.0049 12.8917C12.9273 13.3352 12.8433 13.8149 12.765 14.3552C12.623 15.3338 12.5 17.1073 12.4681 18.3178V23.9999H15.3687H15.5521V18.0337V15.382C15.5511 12.8199 15.171 10.3123 13.6837 8.16973C13.6804 8.16426 13.677 8.15925 13.6735 8.15416ZM6.01275 16.3747L6.01207 16.3757C5.90066 16.3224 5.75869 16.3155 5.60687 16.4242C5.58989 16.4361 5.5746 16.4519 5.56374 16.4689C5.46013 16.6255 5.49342 16.7782 5.58785 16.8797C7.6529 19.2648 8.54752 20.8444 8.95679 23.8532C8.96801 23.937 9.04443 24 9.13545 24H11.4087C11.5082 24 11.5891 23.925 11.5891 23.8327V16.6752C11.5891 16.3054 11.5011 15.9403 11.3323 15.6054C10.1391 13.2405 8.92453 11.2589 6.53546 9.90098C6.5304 9.89757 6.52503 9.89459 6.51955 9.89156L6.51168 9.88712C6.50557 9.88334 6.49945 9.87988 6.49198 9.87736C6.38058 9.82413 6.23895 9.8172 6.08713 9.92555C6.07048 9.93752 6.0552 9.95296 6.04433 9.96965C5.94006 10.1262 5.97301 10.2796 6.06777 10.3813C8.1413 12.7756 8.79682 15.3456 9.20168 18.3705C9.22274 18.5296 9.01624 18.6247 8.89599 18.5097C8.05096 17.7011 7.09621 16.9905 6.05486 16.399C6.04984 16.3954 6.04449 16.3925 6.03927 16.3897L6.03278 16.3861L6.02509 16.3816C6.021 16.3792 6.01693 16.3769 6.01275 16.3747ZM25.9873 16.3747L25.9883 16.3757C26.0997 16.3224 26.2413 16.3155 26.3935 16.4242C26.4102 16.4361 26.4254 16.4519 26.4366 16.4689C26.54 16.6255 26.507 16.7782 26.4122 16.8797C24.3472 19.2648 23.4525 20.8444 23.0436 23.8532C23.0321 23.937 22.956 24 22.8649 24H20.5917C20.4919 24 20.4114 23.925 20.4114 23.8327V16.6752C20.4114 16.3054 20.4993 15.9403 20.6681 15.6054C21.8613 13.2405 23.0755 11.2589 25.4646 9.90098C25.4694 9.89772 25.4747 9.89485 25.48 9.89195L25.4887 9.88712C25.4948 9.88334 25.5009 9.87988 25.5084 9.87736C25.6198 9.82413 25.7611 9.8172 25.9129 9.92555C25.9299 9.93752 25.9448 9.95296 25.956 9.96965C26.06 10.1262 26.027 10.2796 25.9323 10.3813C23.8587 12.7756 23.2036 15.3456 22.7987 18.3705C22.7777 18.5296 22.9842 18.6247 23.1041 18.5097C23.9494 17.7011 24.9042 16.9905 25.9455 16.399C25.9508 16.395 25.9568 16.3919 25.9627 16.3887L25.9676 16.3861L25.9757 16.3813C25.9795 16.379 25.9833 16.3768 25.9873 16.3747ZM16.4758 15.3799C16.4757 15.3806 16.4755 15.3814 16.4755 15.382V18.0337V23.9999H16.6586H19.5595V18.3178C19.5276 17.1073 19.4046 15.3338 19.2627 14.3552C19.1845 13.8161 19.1006 13.3372 19.0231 12.8945C18.7448 11.3056 18.5482 10.1827 18.9899 8.41416L18.9886 8.41353C19.011 8.33982 19.0069 8.25887 18.9682 8.18422C18.884 8.02231 18.6737 7.95427 18.4988 8.03239C18.4465 8.0557 18.4047 8.09035 18.3718 8.13067L18.3708 8.13004C18.3682 8.13333 18.366 8.13672 18.3638 8.1401C18.3622 8.14255 18.3606 8.14498 18.3589 8.14736L18.3576 8.14911C18.3526 8.156 18.348 8.16246 18.3439 8.16973C16.8566 10.3123 16.4762 12.8199 16.4759 15.3789C16.4759 15.3792 16.4758 15.3795 16.4758 15.3799Z"
                              fill="#A8C66C"
                            />
                          </svg>
                          <div className="text-black text-base font-normal font-['Roboto'] leading-tight">Grass</div>
                        </div>
                        <div className="text-black text-2xl font-medium font-['Roboto'] leading-10">
                          {GreenSpacePercentage_Grass}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vegetation Health Card */}
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="self-stretch text-center text-black/50 text-lg font-normal font-['Roboto'] leading-tight">
                Average health of urban vegetation
              </div>
              <div className="self-stretch p-4 bg-[#FAFAFA] rounded-lg flex flex-col justify-start items-center gap-2">
                <div className="text-center text-black text-[32px] font-medium font-['Roboto'] leading-10">
                  {VegetationHealth.toFixed(2)}
                </div>
                <div className="w-full h-4 relative bg-[#efeff4] rounded-[100px] overflow-hidden">
                  <div
                    className="h-6 left-0 top-[-3.50px] absolute overflow-hidden"
                    style={{ width: `${VegetationHealth * 100}%` }}
                  >
                    <div className="relative size-[340px] left-[-93px] top-[-153px]">
                      <Image
                        src={`/images/scales/scale-${scaleIndex}.png`}
                        alt={`Vegetation health: ${VegetationHealth.toFixed(2)}`}
                        width={340}
                        height={340}
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Card */}
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="self-stretch text-center text-black/50 text-lg font-normal font-['Roboto'] leading-tight">
                Distribution of urban green space
              </div>
              <div className="self-stretch p-4 bg-[#FAFAFA] rounded-lg flex flex-col justify-start items-center gap-2">
                <div className="text-center text-black text-[32px] font-medium font-['Roboto'] leading-10">
                  {distributionValue}%
                </div>
                <div className="w-full h-4 relative bg-[#efeff4] rounded-[100px] overflow-hidden">
                  <div
                    className="h-6 left-0 top-[-3.50px] absolute overflow-hidden"
                    style={{ width: `${distributionValue}%` }}
                  >
                    <div className="relative size-[340px] left-[-93px] top-[-153px]">
                      <Image
                        src="/images/3-bg-map.png"
                        alt={`Distribution: ${distributionValue}%`}
                        width={340}
                        height={340}
                        priority
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLayeredPieChart;
