
import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, CloudFog, CloudLightning } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temp: 0,
    condition: 'sunny',
    humidity: 0,
    windSpeed: 0,
    location: 'Your Location',
    loaded: false
  });

  useEffect(() => {
    // Mock weather data for demonstration
    // In a real application, you would fetch data from a weather API
    setTimeout(() => {
      setWeather({
        temp: 28,
        condition: 'sunny',
        humidity: 65,
        windSpeed: 12,
        location: 'Delhi, India',
        loaded: true
      });
    }, 1000);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={48} className="text-yellow-500" />;
      case 'partly-cloudy':
        return <CloudSun size={48} className="text-weather" />;
      case 'cloudy':
        return <Cloud size={48} className="text-gray-500" />;
      case 'rainy':
        return <CloudRain size={48} className="text-weather" />;
      case 'foggy':
        return <CloudFog size={48} className="text-gray-400" />;
      case 'stormy':
        return <CloudLightning size={48} className="text-purple-500" />;
      default:
        return <Sun size={48} className="text-yellow-500" />;
    }
  };

  if (!weather.loaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xl">{weather.location}</h3>
            <p className="text-2xl font-semibold">{weather.temp}°C</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="font-medium">{weather.humidity}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Wind</p>
            <p className="font-medium">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
