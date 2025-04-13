export type CityData = {
  Name: string;
  Latitude: number;
  Longitude: number;
  URL: string;
  GreenSpacePercentage: number;
  GreenSpacePercentage_Trees: number;
  GreenSpacePercentage_Grass: number;
  VegetationHealth: number;
  GreenSpaceDistribution: number;
};

export async function loadCityData(): Promise<CityData[]> {
  try {
    const response = await fetch('/data/city_data.csv');
    const csvText = await response.text();

    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    return lines
      .slice(1)
      .map((line) => {
        const values = line.split(',');
        const cityData = {} as Record<keyof CityData, string | number>;

        headers.forEach((header, i) => {
          let value: string | number = values[i]?.trim() || '';

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
            value = parseFloat(value as string) || 0;
          }

          cityData[header as keyof CityData] = value;
        });

        return cityData as CityData;
      })
      .filter((city) => city.Name);
  } catch (error) {
    console.error('Failed to load city data:', error);
    return [];
  }
}
