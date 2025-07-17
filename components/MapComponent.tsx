'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface BusStop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  routes: string[];
}

interface BusRoute {
  id: string;
  name: string;
  color: string;
  coordinates: [number, number][];
  stops: string[];
}

interface MapComponentProps {
  busStops: BusStop[];
  busRoutes: BusRoute[];
}

// Create a separate component for the actual map that will be dynamically imported
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="map-container">
      <div className="map-loading-overlay">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Harita yükleniyor...</p>
      </div>
    </div>
  )
});

const MapComponent: React.FC<MapComponentProps> = ({ busStops, busRoutes }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="map-container">
        <div className="map-loading-overlay">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Harita hazırlanıyor...</p>
        </div>
      </div>
    );
  }

  return <LeafletMap busStops={busStops} busRoutes={busRoutes} />;
};

export default MapComponent; 