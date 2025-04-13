'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { CityData } from '../types';
import SimpleLayeredPieChart from '../components/SimpleLayeredPieChart';
import CityTooltip from '../components/CityTooltip';

// Set Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// CSVデータの読み込み関数
async function loadCityData(): Promise<CityData[]> {
  try {
    const response = await fetch('/data/city_data.csv');
    const csvText = await response.text();

    // CSVパース（シンプルな実装）
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines
      .slice(1)
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const values = line.split(',');
        const cityData: Partial<CityData> = {};

        headers.forEach((header, i) => {
          let value: string | number = values[i]?.trim() || '';

          // Convert to number if the field is numeric
          if (
            [
              'Latitude',
              'Longitude',
              'GreenSpacePercentage',
              'GreenSpacePercentage_Trees',
              'GreenSpacePercentage_Grass',
              'VegetationHealth',
              'GreenSpaceDistribution',
            ].includes(header)
          ) {
            
            value = typeof value === 'string' ? parseFloat(value) || 0 : value;
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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  // Removed unused mapLoaded state

  // Move fallbackData here
  const fallbackData: CityData[] = [
    {
      Name: 'New York City',
      Latitude: 40.7128,
      Longitude: -74.006,
      URL: '',
      GreenSpacePercentage: 23,
      GreenSpacePercentage_Trees: 20,
      GreenSpacePercentage_Grass: 3,
      VegetationHealth: 0.64,
      GreenSpaceDistribution: 0,
    },
    {
      Name: 'Tokyo',
      Latitude: 35.6762,
      Longitude: 139.6503,
      URL: '',
      GreenSpacePercentage: 20,
      GreenSpacePercentage_Trees: 14,
      GreenSpacePercentage_Grass: 6,
      VegetationHealth: 0.66,
      GreenSpaceDistribution: 0,
    },
    {
      Name: 'Sydney',
      Latitude: -33.8688,
      Longitude: 151.2093,
      URL: '',
      GreenSpacePercentage: 42,
      GreenSpacePercentage_Trees: 34,
      GreenSpacePercentage_Grass: 8,
      VegetationHealth: 0.69,
      GreenSpaceDistribution: 0,
    },
  ];

  const displayCities = cities.length > 0 ? cities : fallbackData;

  const regions = [
    'Africa',
    'Central East Asia',
    'East, Southeast Asia and Oceania',
    'Europe',
    'Latin America',
    'North America',
    'South and West Asia',
  ];

  const getCityRegion = (cityName: string) => {
    switch (cityName) {
      case 'Tokyo':
      case 'Sydney':
      case 'Singapore':
        return 'East, Southeast Asia and Oceania';
      case 'London':
      case 'Paris':
        return 'Europe';
      case 'São Paulo':
        return 'Latin America';
      case 'New York City':
      case 'Toronto':
        return 'North America';
      default:
        return '';
    }
  };

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

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [139.69171, 35.6895],
      zoom: 1,
      renderWorldCopies: false,
    });

    // Wait for both style and source to be loaded
    map.current.on('style.load', () => {
      if (!map.current) return;

      // Wait for the water layer to be available
      if (map.current.getLayer('water')) {
        map.current.setPaintProperty('water', 'fill-color', '#ECF1ED');
      } else {
        map.current.on('sourcedata', () => {
          if (map.current?.getLayer('water')) {
            map.current.setPaintProperty('water', 'fill-color', '#ECF1ED');
          }
        });
      }
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.setProjection('mercator');

      const svgIcon = `
        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="19" fill="#186000" fill-opacity="0.2" stroke="#186000" stroke-width="4"/>
        </svg>
      `;

      const img = new window.Image();
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgIcon)}`;

      img.onload = () => {
        if (!map.current) return;
        map.current.addImage('custom-icon', img);

        // Convert cities data to GeoJSON
        const citiesGeoJSON: FeatureCollection<Geometry, GeoJsonProperties> = {
          type: 'FeatureCollection',
          features: displayCities.map((city) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [city.Longitude, city.Latitude],
            },
            properties: {
              description: city.Name,
              greenSpace: city.GreenSpacePercentage,
            },
          })),
        };

        map.current.addSource('cities', {
          type: 'geojson',
          data: citiesGeoJSON,
        });

        map.current.addLayer({
          id: 'city-symbols',
          type: 'symbol',
          source: 'cities',
          layout: {
            'icon-image': 'custom-icon',
            'icon-size': 1,
            'icon-allow-overlap': true,
          },
        });

        map.current.on('click', 'city-symbols', (e) => {
          if (!e.features || e.features.length === 0 || !map.current) return;

          const geometry = e.features[0].geometry as { type: 'Point'; coordinates: number[] };
          const coordinates = geometry.coordinates.slice();
          const cityName = e.features[0].properties?.description;

          if (!cityName) return;

          const container = document.createElement('div');
          container.className = 'popup-content';

          new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            maxWidth: '160px',
            className: 'custom-popup',
          })
            .setLngLat(coordinates as [number, number])
            .setDOMContent(container)
            .addTo(map.current);

          const root = ReactDOM.createRoot(container);
          root.render(<CityTooltip cityName={cityName} />);
        });

        // Removed unused setMapLoaded call
      };
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [displayCities]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p>Loading city data...</p>
      </main>
    );
  }

  if (error && displayCities.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <p className="text-red-500">{error}</p>
        <p className="mt-4">Using fallback data instead.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Urban Green Space Visualization</h1>
      <p className="text-base md:text-lg md:text-center mb-10 max-w-5xl mx-auto">
        According to UN projections, 68% of the world&apos;s population is expected to live in urban areas by 2050.
        <br className='hidden md:block'/>
        Amid rapid urbanization, I focused on the importance of harmony between cities and nature.
        <br />
        This project aims to visualize the current state of green spaces in urban areas,
        <br className='hidden md:block' />
        and convey the importance of sustainable urban development that connects people with nature.
        <br />
        Source:
        <a
          href="https://hugsi.green/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          Husqvarna Urban Green Space Insights
        </a>
      </p>

      <div ref={mapContainer} className="w-full aspect-3/4 md:w-4/5 md:aspect-16/9 md:min-w-6xl mx-auto mb-10" />

      <div className="flex flex-col gap-12 max-w-7xl mx-auto">
        {regions.map((region) => {
          const regionCities = displayCities.filter((city) => getCityRegion(city.Name) === region);
          if (regionCities.length === 0) return null;

          return (
            <div key={region} className="w-full">
              <h2 className="text-4xl font-semibold mb-6 ">{region}</h2>
              <div className="flex flex-wrap justify-start gap-8">
                {regionCities.map((city, index) => (
                  <div
                    key={city.Name || index}
                    id={`city-${city.Name.replace(/\s+/g, '-')}`}
                    className="w-full sm:w-auto bg-white rounded-2xl shadow-sm py-6 px-7  "
                  >
                    <SimpleLayeredPieChart cityData={city} size={300} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        .popup-content {
          padding: 0.5rem;
          text-align: center;
        }
        .custom-popup .mapboxgl-popup-content {
          padding: 8px;
          border-radius: 8px;
        }
        .mapboxgl-popup-close-button {
          font-size: 1rem;
          width: 1.25rem;
          height: 1.25rem;
          line-height: 1.25rem;
          transition: all 0.2s;
          border-radius: 100px;
          margin: 0.2rem 0.2rem 0rem 0rem;
          padding: 0;
        }
        .mapboxgl-popup-close-button span {
          height: 1rem;
        }
        .mapboxgl-popup-close-button:hover {
          background-color: #919191;
          opacity: 0.4;
          color: white;
        }
        .city-card-focused {
          // border: #186000 solid 2px;
          // transform: translateY(-4px);
          box-shadow: 0 40px 45px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          transition: all 0.3s ease;
        }
        .w-full.sm\\:w-auto {
          transition: border 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </main>
  );
}