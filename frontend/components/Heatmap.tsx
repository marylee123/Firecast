"use client";

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

export default function Heatmap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [heatmap, setHeatmap] = useState<any>(null);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);

  useEffect(() => {
    const initMap = () => {
      const google = window.google;
      const newMap = new google.maps.Map(mapRef.current, {
        zoom: 4,
        center: { lat: 37.7749, lng: -122.4194 },
        mapTypeId: 'roadmap',
      });

      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: [],
        map: newMap,
      });

      setMap(newMap);
      setHeatmap(newHeatmap);
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC-9o9lru7REt3WYglAL2V-SUTJireSpl0&libraries=visualization`;
      script.async = true;
      script.onload = () => initMap();
      document.head.appendChild(script);
    }
  }, []);

  const loadData = async () => {
    try {
      // Call the Flask API
      const response = await fetch('http://127.0.0.1:5000/get_prediction?month=' + month + '&day=' + day);
      const data = await response.json();

      // Convert the data into Google Maps LatLng objects
      const heatmapData = data.map((item: any) => ({
        location: new window.google.maps.LatLng(item.latitude, item.longitude),
        weight: item.prediction,
      }));

      heatmap.setData(heatmapData);

      // Adjust the map to show the heatmap points
      if (heatmapData.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        heatmapData.forEach((point: any) => bounds.extend(point.location));
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const toggleHeatmap = () => {
    heatmap.setMap(heatmap.getMap() ? null : map);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex space-x-4 my-4 items-center">
        <label >
          Month:
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label>
          Day:
          <select value={day} onChange={(e) => setDay(Number(e.target.value))}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <button onClick={loadData} className="bg-red-500 text-white px-4 py-2 rounded font-manrope">
          Load Data
        </button>
        <button onClick={toggleHeatmap} className="bg-orange-500 w-50 text-white px-4 py-2 rounded font-manrope">
          Toggle Heatmap
        </button>
      </div>
      <div ref={mapRef} id="map" className="absolute top-0 left-0 w-full h-screen z-0 mt-64" />
    </div>
  );
}
