'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LoadingSpinner from '../../components/LoadingSpinner';
import UniversityBusService from '../../lib/universityBusService';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('../../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="map-loading-overlay"><LoadingSpinner /></div>
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

interface BusSchedule {
  time: string;
  type: 'normal' | 'express' | 'university';
  destination?: string;
  university?: string;
}

interface UniversityBusData {
  university: string;
  routes: {
    [key: string]: {
      weekday: BusSchedule[];
      weekend: BusSchedule[];
    };
  };
}

const DolmusClient = () => {
  const [selectedRoute, setSelectedRoute] = useState('gazimagusa-girne');
  const [selectedDay, setSelectedDay] = useState('weekday');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [universityBusData, setUniversityBusData] = useState<UniversityBusData[]>([]);
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Bus stops data
  const busStops: BusStop[] = [
    { id: 'gazimagusa-center', name: 'Gazimağusa Merkez', lat: 35.1264, lng: 33.9378, routes: ['gazimagusa-girne', 'gazimagusa-lefkosia'] },
    { id: 'neu-campus', name: 'NEU Kampüs', lat: 35.1419, lng: 33.9097, routes: ['neu-shuttle'] },
    { id: 'girne-center', name: 'Girne Merkez', lat: 35.3419, lng: 33.3181, routes: ['gazimagusa-girne', 'girne-lefkosia'] },
    { id: 'lefkosia-center', name: 'Lefkoşa Merkez', lat: 35.1856, lng: 33.3823, routes: ['gazimagusa-lefkosia', 'girne-lefkosia'] },
    { id: 'eul-campus', name: 'EUL Kampüs', lat: 35.1533, lng: 33.9025, routes: ['eul-shuttle'] },
    { id: 'lefke-center', name: 'Lefke Merkez', lat: 35.1072, lng: 32.8539, routes: ['lefke-gazimagusa', 'lefke-lefkosia'] }
  ];

  // Bus routes data
  const busRoutes: BusRoute[] = [
    {
      id: 'gazimagusa-girne',
      name: 'Gazimağusa - Girne',
      color: '#3B82F6',
      coordinates: [[35.1264, 33.9378], [35.2341, 33.6289], [35.3419, 33.3181]],
      stops: ['gazimagusa-center', 'girne-center']
    },
    {
      id: 'neu-shuttle',
      name: 'NEU Kampüs Servisi',
      color: '#10B981',
      coordinates: [[35.1264, 33.9378], [35.1419, 33.9097]],
      stops: ['gazimagusa-center', 'neu-campus']
    },
    {
      id: 'eul-shuttle',
      name: 'EUL Kampüs Servisi',
      color: '#8B5CF6',
      coordinates: [[35.1264, 33.9378], [35.1533, 33.9025]],
      stops: ['gazimagusa-center', 'eul-campus']
    }
  ];

  const universities = [
    { id: 'all', name: 'Tüm Güzergahlar', website: '' },
    { id: 'neu', name: 'Yakın Doğu Üniversitesi', website: 'https://bus.neu.edu.tr/' },
    { id: 'eul', name: 'Avrupa Üniversitesi', website: 'https://eul.edu.tr/' },
    { id: 'ciu', name: 'Kıbrıs Uluslararası Üniversitesi', website: 'https://ciu.edu.tr/' },
    { id: 'uiu', name: 'Uluslararası İslam Üniversitesi', website: 'https://uiu.edu.tr/' }
  ];

  const routes = [
    { id: 'gazimagusa-girne', name: 'Gazimağusa - Girne', distance: '45 km', duration: '45 dk' },
    { id: 'gazimagusa-lefkosia', name: 'Gazimağusa - Lefkoşa', distance: '55 km', duration: '55 dk' },
    { id: 'girne-lefkosia', name: 'Girne - Lefkoşa', distance: '25 km', duration: '30 dk' },
    { id: 'lefke-gazimagusa', name: 'Lefke - Gazimağusa', distance: '35 km', duration: '40 dk' },
    { id: 'lefke-lefkosia', name: 'Lefke - Lefkoşa', distance: '50 km', duration: '50 dk' },
    { id: 'neu-shuttle', name: 'NEU Kampüs Servisi', distance: '5 km', duration: '10 dk' },
    { id: 'eul-shuttle', name: 'EUL Kampüs Servisi', distance: '8 km', duration: '15 dk' }
  ];

  // Fetch university bus data
  const fetchUniversityBusData = async (universityId: string) => {
    setLoading(true);
    try {
      const busService = UniversityBusService.getInstance();
      const data = await busService.fetchUniversityBusData(universityId);
      
      // Transform the data to match the expected format
      const transformedData: UniversityBusData[] = data.map(university => ({
        university: university.university,
        routes: university.routes.reduce((acc, route) => {
          acc[route.id] = {
            weekday: route.weekday,
            weekend: route.weekend
          };
          return acc;
        }, {} as { [key: string]: { weekday: BusSchedule[]; weekend: BusSchedule[] } })
      }));
      
      setUniversityBusData(transformedData);
    } catch (error) {
      console.error('Üniversite otobüs verileri alınamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversityBusData(selectedUniversity);
  }, [selectedUniversity]);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const schedules = {
    'gazimagusa-girne': {
      weekday: [
        { time: '06:00', type: 'normal' as const },
        { time: '07:00', type: 'normal' as const },
        { time: '08:00', type: 'express' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'express' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'express' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const },
        { time: '21:00', type: 'normal' as const },
        { time: '22:00', type: 'normal' as const }
      ],
      weekend: [
        { time: '07:00', type: 'normal' as const },
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'normal' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'normal' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const },
        { time: '21:00', type: 'normal' as const }
      ]
    },
    'neu-shuttle': {
      weekday: [
        { time: '07:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '08:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '09:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '10:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '11:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '12:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '13:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '14:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '15:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '16:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '17:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '18:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '19:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '20:00', type: 'university' as const, destination: 'Kampüs → Merkez' }
      ],
      weekend: [
        { time: '09:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '12:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '15:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '18:00', type: 'university' as const, destination: 'Kampüs → Merkez' }
      ]
    },
    'eul-shuttle': {
      weekday: [
        { time: '07:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '08:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '09:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '10:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '11:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '12:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '13:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '14:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '15:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '16:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '17:30', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '18:30', type: 'university' as const, destination: 'Kampüs → Merkez' }
      ],
      weekend: [
        { time: '10:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '14:00', type: 'university' as const, destination: 'Kampüs → Merkez' },
        { time: '18:00', type: 'university' as const, destination: 'Kampüs → Merkez' }
      ]
    }
  };

  // Add other route schedules...
  const allSchedules = {
    ...schedules,
    'gazimagusa-lefkosia': {
      weekday: [
        { time: '06:30', type: 'normal' as const },
        { time: '07:30', type: 'express' as const },
        { time: '08:30', type: 'normal' as const },
        { time: '09:30', type: 'normal' as const },
        { time: '10:30', type: 'normal' as const },
        { time: '11:30', type: 'normal' as const },
        { time: '12:30', type: 'express' as const },
        { time: '13:30', type: 'normal' as const },
        { time: '14:30', type: 'normal' as const },
        { time: '15:30', type: 'normal' as const },
        { time: '16:30', type: 'express' as const },
        { time: '17:30', type: 'normal' as const },
        { time: '18:30', type: 'normal' as const },
        { time: '19:30', type: 'normal' as const },
        { time: '20:30', type: 'normal' as const },
        { time: '21:30', type: 'normal' as const }
      ],
      weekend: [
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'normal' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'normal' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const }
      ]
    },
    'girne-lefkosia': {
      weekday: [
        { time: '06:00', type: 'normal' as const },
        { time: '07:00', type: 'express' as const },
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'express' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'express' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const },
        { time: '21:00', type: 'normal' as const }
      ],
      weekend: [
        { time: '07:00', type: 'normal' as const },
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'normal' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'normal' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const }
      ]
    },
    'lefke-gazimagusa': {
      weekday: [
        { time: '06:00', type: 'normal' as const },
        { time: '07:00', type: 'normal' as const },
        { time: '08:00', type: 'express' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'express' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'express' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const },
        { time: '20:00', type: 'normal' as const }
      ],
      weekend: [
        { time: '07:00', type: 'normal' as const },
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'normal' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'normal' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const }
      ]
    },
    'lefke-lefkosia': {
      weekday: [
        { time: '06:30', type: 'normal' as const },
        { time: '07:30', type: 'express' as const },
        { time: '08:30', type: 'normal' as const },
        { time: '09:30', type: 'normal' as const },
        { time: '10:30', type: 'normal' as const },
        { time: '11:30', type: 'normal' as const },
        { time: '12:30', type: 'express' as const },
        { time: '13:30', type: 'normal' as const },
        { time: '14:30', type: 'normal' as const },
        { time: '15:30', type: 'normal' as const },
        { time: '16:30', type: 'express' as const },
        { time: '17:30', type: 'normal' as const },
        { time: '18:30', type: 'normal' as const },
        { time: '19:30', type: 'normal' as const },
        { time: '20:30', type: 'normal' as const }
      ],
      weekend: [
        { time: '08:00', type: 'normal' as const },
        { time: '09:00', type: 'normal' as const },
        { time: '10:00', type: 'normal' as const },
        { time: '11:00', type: 'normal' as const },
        { time: '12:00', type: 'normal' as const },
        { time: '13:00', type: 'normal' as const },
        { time: '14:00', type: 'normal' as const },
        { time: '15:00', type: 'normal' as const },
        { time: '16:00', type: 'normal' as const },
        { time: '17:00', type: 'normal' as const },
        { time: '18:00', type: 'normal' as const },
        { time: '19:00', type: 'normal' as const }
      ]
    }
  };

  const getCurrentSchedule = () => {
    return allSchedules[selectedRoute as keyof typeof allSchedules]?.[selectedDay as keyof typeof allSchedules[keyof typeof allSchedules]] || [];
  };

  const getScheduleTypeColor = (type: string) => {
    switch (type) {
      case 'express':
        return 'text-red-600 bg-red-50';
      case 'university':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getScheduleTypeText = (type: string) => {
    switch (type) {
      case 'express':
        return 'Ekspres';
      case 'university':
        return 'Üniversite';
      default:
        return 'Normal';
    }
  };

  const renderMap = () => {
    if (!mapLoaded) {
      return (
        <div className="map-container">
          <div className="map-loading-overlay">
            <LoadingSpinner />
          </div>
        </div>
      );
    }

    return <MapComponent busStops={busStops} busRoutes={busRoutes} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Otobüs Saatleri</h1>
          <p className="text-lg text-gray-200 mb-8">
            Üniversite kampüs servisleri ve şehirler arası otobüs saatlerini kolayca öğrenin.
            Güncel sefer bilgileri ve rota haritaları ile yolculuğunuzu planlayın.
          </p>
          
          {/* Coming Soon Message */}
          <div className="mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-2xl">🚧</span>
                <h3 className="text-xl font-semibold">Yakında Gelecek</h3>
                <span className="text-2xl">🚧</span>
              </div>
              <p className="text-gray-200 mb-4">
                Diğer üniversitelerin otobüs saatleri yakında eklenecek. 
                Şimdilik sadece Yakın Doğu Üniversitesi'nin resmi sitesine yönlendiriliyoruz.
              </p>
              <p className="text-gray-200 text-sm">
                Güncellemeler için bizimle iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* University Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* NEU Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🚌</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Yakın Doğu Üniversitesi</h3>
                  <p className="text-gray-600">Güncel otobüs saatleri</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Kampüs servisleri ve şehirler arası otobüs saatlerini görüntüleyin.
              </p>
              <a
                href="https://bus.neu.edu.tr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Otobüs Saatlerini Görüntüle
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Other Universities Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⏳</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Diğer Üniversiteler</h3>
                  <p className="text-gray-600">Yakında eklenecek</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Avrupa Üniversitesi, Kıbrıs Uluslararası Üniversitesi ve diğer üniversitelerin 
                otobüs saatleri yakında burada olacak.
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-medium">
                <span className="text-sm">Geliştirme aşamasında</span>
                <span className="text-lg">🔧</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Önemli Bilgiler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">📅 Güncellemeler</h4>
                <p className="text-gray-600 text-sm">
                  Otobüs saatleri düzenli olarak güncellenir. 
                  En güncel bilgiler için üniversitelerin resmi sitelerini takip edin.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">⚠️ Önemli Not</h4>
                <p className="text-gray-600 text-sm">
                  Sefer saatleri hava durumu, trafik ve özel durumlara göre değişebilir. 
                  Yolculuk öncesi son kontrolü yapmanızı öneririz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DolmusClient; 