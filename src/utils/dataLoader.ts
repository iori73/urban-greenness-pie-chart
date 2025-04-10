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
      
      // CSVパース（シンプルな実装）
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      return lines.slice(1).map(line => {
        const values = line.split(',');
        const cityData: any = {};
        
        headers.forEach((header, i) => {
          let value: any = values[i]?.trim();
          
          // 数値に変換すべきフィールドを変換
          if (['Latitude', 'Longitude', 'GreenSpacePercentage', 
               'GreenSpacePercentage_Trees', 'GreenSpacePercentage_Grass', 
               'VegetationHealth', 'GreenSpaceDistribution'].includes(header)) {
            value = parseFloat(value);
          }
          
          cityData[header] = value;
        });
        
        return cityData as CityData;
      }).filter(city => city.Name); // 空の行を除外
    } catch (error) {
      console.error('Failed to load city data:', error);
      return [];
    }
  }