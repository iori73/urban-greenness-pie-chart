// // import Image from "next/image";

// // export default function Home() {
// //   return (
// //     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
// //       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
// //         <Image
// //           className="dark:invert"
// //           src="/next.svg"
// //           alt="Next.js logo"
// //           width={180}
// //           height={38}
// //           priority
// //         />
// //         <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
// //           <li className="mb-2 tracking-[-.01em]">
// //             Get started by editing{" "}
// //             <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
// //               src/app/page.tsx
// //             </code>
// //             .
// //           </li>
// //           <li className="tracking-[-.01em]">
// //             Save and see your changes instantly.
// //           </li>
// //         </ol>

// //         <div className="flex gap-4 items-center flex-col sm:flex-row">
// //           <a
// //             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
// //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             <Image
// //               className="dark:invert"
// //               src="/vercel.svg"
// //               alt="Vercel logomark"
// //               width={20}
// //               height={20}
// //             />
// //             Deploy now
// //           </a>
// //           <a
// //             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
// //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //           >
// //             Read our docs
// //           </a>
// //         </div>
// //       </main>
// //       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/file.svg"
// //             alt="File icon"
// //             width={16}
// //             height={16}
// //           />
// //           Learn
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/window.svg"
// //             alt="Window icon"
// //             width={16}
// //             height={16}
// //           />
// //           Examples
// //         </a>
// //         <a
// //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// //           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           <Image
// //             aria-hidden
// //             src="/globe.svg"
// //             alt="Globe icon"
// //             width={16}
// //             height={16}
// //           />
// //           Go to nextjs.org →
// //         </a>
// //       </footer>
// //     </div>
// //   );
// // }


// 'use client';

// import { useEffect, useState } from 'react';
// import { CityData, loadCityData } from '../utils/dataLoader';
// import CityCard from '../components/CityCard';

// export default function Home() {
//   const [cities, setCities] = useState<CityData[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     async function fetchData() {
//       const data = await loadCityData();
//       setCities(data);
//       setLoading(false);
//     }
    
//     fetchData();
//   }, []);
  
//   if (loading) {
//     return (
//       <main className="flex min-h-screen flex-col items-center justify-center p-24">
//         <p>Loading city data...</p>
//       </main>
//     );
//   }
  
//   return (
//     <main className="min-h-screen p-4 md:p-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Urban Green Space Dashboard</h1>
      
//       <div className="flex flex-wrap justify-center gap-8">
//         {cities.map((city) => (
//           <div key={city.Name} className="w-full md:w-auto">
//             <CityCard cityData={city} />
//           </div>
//         ))}
//       </div>
//     </main>
//   );
// }



// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CityData } from '../types';
import CityCard from '../components/CityCard'; // 既存コンポーネント（表示しない）
// import LayeredPieChart from '../components/LayeredPieChart'; // 新しいコンポーネント
import SimpleLayeredPieChart from '../components/SimpleLayeredPieChart'; // 新しいコンポーネント


// CSVデータの読み込み関数
async function loadCityData(): Promise<CityData[]> {
  try {
    const response = await fetch('/data/city_data.csv');
    const csvText = await response.text();
    
    // CSVパース（シンプルな実装）
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1)
      .filter(line => line.trim().length > 0)
      .map(line => {
        const values = line.split(',');
        const cityData: any = {};
        
        headers.forEach((header, i) => {
          let value: any = values[i]?.trim() || '';
          
          // 数値に変換すべきフィールドを変換
          if (['Latitude', 'Longitude', 'GreenSpacePercentage', 
               'GreenSpacePercentage_Trees', 'GreenSpacePercentage_Grass', 
               'VegetationHealth', 'GreenSpaceDistribution'].includes(header)) {
            value = parseFloat(value) || 0;
          }
          
          cityData[header] = value;
        });
        
        return cityData as CityData;
      });
  } catch (error) {
    console.error('Failed to load city data:', error);
    return [];
  }
}

export default function Home() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data...');
        const data = await loadCityData();
        console.log('Data loaded:', data);
        
        if (data && data.length > 0) {
          setCities(data);
        } else {
          // データが空の場合
          setError('No city data found');
          console.warn('No data found in CSV');
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(`Failed to load city data: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // ダミーデータ（CSVが読み込めなかった場合のフォールバック）
  const fallbackData: CityData[] = [
    {
      Name: "New York City",
      Latitude: 40.7128,
      Longitude: -74.0060,
      URL: "",
      GreenSpacePercentage: 23,
      GreenSpacePercentage_Trees: 20,
      GreenSpacePercentage_Grass: 3,
      VegetationHealth: 0.64,
      GreenSpaceDistribution: 0
    },
    {
      Name: "Tokyo",
      Latitude: 35.6762,
      Longitude: 139.6503,
      URL: "",
      GreenSpacePercentage: 20,
      GreenSpacePercentage_Trees: 14,
      GreenSpacePercentage_Grass: 6,
      VegetationHealth: 0.66,
      GreenSpaceDistribution: 0
    },
    {
      Name: "Sydney",
      Latitude: -33.8688,
      Longitude: 151.2093,
      URL: "",
      GreenSpacePercentage: 42,
      GreenSpacePercentage_Trees: 34,
      GreenSpacePercentage_Grass: 8,
      VegetationHealth: 0.69,
      GreenSpaceDistribution: 0
    }
  ];

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading city data...</p>
      </main>
    );
  }
  
  // データが空の場合はフォールバックデータを使用
  const displayCities = cities.length > 0 ? cities : fallbackData;
  
  if (error && displayCities.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="text-red-500">{error}</p>
        <p className="mt-4">Using fallback data instead.</p>
      </main>
    );
  }
  
  // return (
  //   <main className="min-h-screen p-6 md:p-8 bg-gray-50">
  //     <h1 className="text-3xl font-bold mb-10 text-center">Urban Green Space Dashboard</h1>
      
  //     <div className="flex flex-wrap justify-center gap-8">
  //       {displayCities.map((city, index) => (
  //         <div key={city.Name || index} className="w-full sm:w-auto bg-white rounded-lg shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
  //           <LayeredPieChart cityData={city} size={300} />
            
  //           {/* 既存のCityCardコンポーネントは非表示に */}
  //           <div className="hidden">
  //             <CityCard cityData={city} />
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </main>
  // );
  return (
    <main className="min-h-screen p-6 md:p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-10 text-center">Urban Green Space Dashboard</h1>
      
      <div className="flex flex-wrap justify-center gap-8">
        {displayCities.map((city, index) => (
          <div key={city.Name || index} className="w-full sm:w-auto bg-white rounded-lg shadow-lg p-6 transition-all hover:-translate-y-1 hover:shadow-xl">
            <SimpleLayeredPieChart cityData={city} size={300} />
            
            {/* 既存のコンポーネントは非表示に */}
            <div className="hidden">
              <CityCard cityData={city} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}