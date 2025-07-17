'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface LeafletMapProps {
  busStops: BusStop[];
  busRoutes: BusRoute[];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ busStops, busRoutes }) => {
  useEffect(() => {
    // Additional leaflet initialization if needed
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={[35.1856, 33.3823]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Render bus stops */}
        {busStops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-sm">{stop.name}</h3>
                <p className="text-xs text-gray-600">
                  Güzergahlar: {stop.routes.join(', ')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render bus routes */}
        {busRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            color={route.color}
            weight={4}
            opacity={0.7}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMap; 