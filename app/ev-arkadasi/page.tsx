'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Users, Calendar, Star, MessageCircle, Heart, Share2, X, Plus, Home, UserPlus } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Mock data for roommates
const mockRoommates = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    age: 22,
    university: "Doğu Akdeniz Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    location: "Gazimağusa",
    price: 800,
    roomType: "Tek kişilik oda",
    availableFrom: "2024-02-01",
    description: "Sakin ve çalışkan bir öğrenci arıyorum. Ev düzenli ve temiz tutulmalı.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    rating: 4.8,
    reviews: 12,
    isVerified: true,
    interests: ["Teknoloji", "Spor", "Müzik"],
    smoking: false,
    pets: false,
    gender: "Erkek",
    type: "seeking" // ev arkadaşı arıyor
  },
  {
    id: 2,
    name: "Ayşe Demir",
    age: 20,
    university: "Girne Amerikan Üniversitesi",
    department: "Psikoloji",
    location: "Girne",
    price: 650,
    roomType: "Paylaşımlı oda",
    availableFrom: "2024-01-15",
    description: "Sosyal ve aktif bir ev arkadaşı arıyorum. Birlikte etkinliklere katılabiliriz.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    rating: 4.6,
    reviews: 8,
    isVerified: true,
    interests: ["Psikoloji", "Yoga", "Kitap okuma"],
    smoking: false,
    pets: true,
    gender: "Kadın",
    type: "seeking"
  },
  {
    id: 3,
    name: "Mehmet Kaya",
    age: 24,
    university: "Lefke Avrupa Üniversitesi",
    department: "İşletme",
    location: "Lefke",
    price: 750,
    roomType: "Stüdyo daire",
    availableFrom: "2024-02-15",
    description: "Çalışkan ve düzenli bir öğrenci arıyorum. Sessiz bir ortam tercih ediyorum.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    rating: 4.9,
    reviews: 15,
    isVerified: true,
    interests: ["İşletme", "Fitness", "Seyahat"],
    smoking: true,
    pets: false,
    gender: "Erkek",
    type: "offering" // ev arıyor
  },
  {
    id: 4,
    name: "Zeynep Özkan",
    age: 21,
    university: "Yakın Doğu Üniversitesi",
    department: "Tıp",
    location: "Lefkoşa",
    price: 900,
    roomType: "Tek kişilik oda",
    availableFrom: "2024-01-20",
    description: "Tıp öğrencisi olduğum için çok çalışıyorum. Anlayışlı bir ev arkadaşı arıyorum.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    rating: 4.7,
    reviews: 10,
    isVerified: true,
    interests: ["Tıp", "Müzik", "Spor"],
    smoking: false,
    pets: false,
    gender: "Kadın",
    type: "offering"
  },
  {
    id: 5,
    name: "Can Arslan",
    age: 23,
    university: "Uluslararası Kıbrıs Üniversitesi",
    department: "Mimarlık",
    location: "Girne",
    price: 700,
    roomType: "Paylaşımlı oda",
    availableFrom: "2024-02-10",
    description: "Yaratıcı ve sanatsal bir ev arkadaşı arıyorum. Birlikte projeler yapabiliriz.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    rating: 4.5,
    reviews: 6,
    isVerified: false,
    interests: ["Mimarlık", "Sanat", "Fotoğrafçılık"],
    smoking: false,
    pets: true,
    gender: "Erkek",
    type: "seeking"
  }
];

export default function EvArkadasiPage() {
  const [roommates, setRoommates] = useState(mockRoommates);
  const [filteredRoommates, setFilteredRoommates] = useState(mockRoommates);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, seeking, offering
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTypeSelection, setShowTypeSelection] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Filter locations
  const locations = [...new Set(roommates.map(r => r.location))];

  // Filter function
  useEffect(() => {
    let filtered = roommates;

    if (searchTerm) {
      filtered = filtered.filter(roommate =>
        roommate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
        roommate.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(roommate => roommate.location === selectedLocation);
    }

    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(roommate => roommate.price >= min && roommate.price <= max);
    }

    if (selectedGender) {
      filtered = filtered.filter(roommate => roommate.gender === selectedGender);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(roommate => roommate.type === selectedType);
    }

    setFilteredRoommates(filtered);
  }, [searchTerm, selectedLocation, selectedPriceRange, selectedGender, selectedType, roommates]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setSelectedGender('');
    setSelectedType('all');
  };

  // Toggle favorite
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Add listing form state
  const [addForm, setAddForm] = useState({
    name: '',
    age: '',
    university: '',
    department: '',
    location: '',
    price: '',
    roomType: '',
    availableFrom: '',
    description: '',
    gender: '',
    smoking: false,
    pets: false,
    interests: [],
    type: 'seeking'
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Mesajınız gönderildi! En kısa sürede size dönüş yapılacak.');
    setShowContactModal(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      id: roommates.length + 1,
      ...addForm,
      age: parseInt(addForm.age),
      price: parseInt(addForm.price),
      rating: 0,
      reviews: 0,
      isVerified: false,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    };
    setRoommates(prev => [newListing, ...prev]);
    setShowAddModal(false);
    setAddForm({
      name: '', age: '', university: '', department: '', location: '', price: '',
      roomType: '', availableFrom: '', description: '', gender: '', smoking: false, pets: false, interests: [], type: 'seeking'
    });
    alert('İlanınız başarıyla eklendi!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1c0f3f] to-[#2e0f5f] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-400">Ev Arkadaşı</span> Bul
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Kıbrıs'ta üniversite öğrencileri için güvenilir ev arkadaşı bulma platformu
            </p>
            <button
              onClick={() => setShowTypeSelection(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-black px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus size={24} className="inline mr-2" />
              İlan Ver
            </button>
          </div>
        </div>
      </div>

      {/* Type Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-lg p-2 flex">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedType === 'all'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedType('seeking')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedType === 'seeking'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <UserPlus size={20} />
              Ev Arkadaşı Arıyor
            </button>
            <button
              onClick={() => setSelectedType('offering')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedType === 'offering'
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              Ev Arıyor
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="İsim, üniversite veya bölüm ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium text-gray-700"
            >
              <Filter size={20} />
              Filtreler
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Şehir</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Tüm şehirler</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Tüm fiyatlar</option>
                    <option value="0-500">0-500 TL</option>
                    <option value="500-750">500-750 TL</option>
                    <option value="750-1000">750-1000 TL</option>
                    <option value="1000-9999">1000+ TL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Tümü</option>
                    <option value="Erkek">Erkek</option>
                    <option value="Kadın">Kadın</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredRoommates.length} sonuç bulundu
          </p>
        </div>

        {/* Roommate Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoommates.map((roommate) => (
            <div key={roommate.id} className="bg-white rounded-xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Card Header */}
              <div className="relative">
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(roommate.id)}
                    className={`p-2 rounded-full ${
                      favorites.includes(roommate.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                    } transition-colors`}
                  >
                    <Heart size={16} fill={favorites.includes(roommate.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full bg-white text-gray-600 hover:text-blue-500 transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    roommate.type === 'seeking'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {roommate.type === 'seeking' ? 'Ev Arkadaşı Arıyor' : 'Ev Arıyor'}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {roommate.type === 'seeking' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-700 text-white font-semibold text-xs">
                      <UserPlus size={16} className="-ml-1" /> Ev Arkadaşı Arıyor
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-gray-900 font-semibold text-xs">
                      <Home size={16} className="-ml-1" /> Ev Arıyor
                    </span>
                  )}
                </div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{roommate.name}</h3>
                    <p className="text-gray-600">{roommate.age} yaşında</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={14} />
                    {roommate.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={14} />
                    {roommate.university} - {roommate.department}
                  </div>
                  {roommate.type === 'offering' ? (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-yellow-400">Bütçe: {roommate.price} TL</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-indigo-700">{roommate.price} TL/ay</span>
                      <span className="text-sm text-gray-500">{roommate.roomType}</span>
                    </div>
                  )}
                  {roommate.type === 'seeking' && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      {new Date(roommate.availableFrom).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {roommate.interests.slice(0, 3).map((interest, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedRoommate(roommate);
                      setShowDetailModal(true);
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300
                      ${roommate.type === 'seeking' ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-yellow-400 text-white hover:bg-yellow-500'}
                    `}
                  >
                    Detayları Gör
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRoommate(roommate);
                      setShowContactModal(true);
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    <MessageCircle size={14} />
                    İletişim
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRoommates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users size={64} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Ev Arkadaşı Detayları</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedRoommate.name}</h3>
                    <p className="text-gray-600">{selectedRoommate.age} yaşında • {selectedRoommate.gender}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {selectedRoommate.type === 'seeking' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-700 text-white font-semibold text-xs">
                          <UserPlus size={16} className="-ml-1" /> Ev Arkadaşı Arıyor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-400 text-gray-900 font-semibold text-xs">
                          <Home size={16} className="-ml-1" /> Ev Arıyor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-600">{selectedRoommate.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span className="text-gray-600">{selectedRoommate.university}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Müsait: {new Date(selectedRoommate.availableFrom).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-gray-900">Oda Bilgileri</h4>
                    <div className="space-y-1 text-sm">
                      {selectedRoommate.type === 'seeking' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Oda Tipi:</span>
                            <span className="font-semibold text-gray-800">{selectedRoommate.roomType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Fiyat:</span>
                            <span className="font-semibold text-indigo-700">{selectedRoommate.price} TL/ay</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-800">Müsait Olduğu Tarih:</span>
                            <span className="font-semibold text-gray-800">{new Date(selectedRoommate.availableFrom).toLocaleDateString('tr-TR')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800">Bütçe Aralığı:</span>
                          <span className="font-semibold text-yellow-500">{selectedRoommate.price} TL</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Sigara:</span>
                        <span className="font-semibold text-gray-800">{selectedRoommate.smoking ? 'Evet' : 'Hayır'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-800">Evcil Hayvan:</span>
                        <span className="font-semibold text-gray-800">{selectedRoommate.pets ? 'Evet' : 'Hayır'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">İlgi Alanları</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoommate.interests.map((interest, index) => (
                        <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Açıklama</h4>
                    <p className="text-gray-600 text-sm">{selectedRoommate.description}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        setShowContactModal(true);
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300
                        ${selectedRoommate.type === 'seeking' ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-yellow-400 text-white hover:bg-yellow-500'}
                      `}
                    >
                      İletişime Geç
                    </button>
                    <button
                      onClick={() => toggleFavorite(selectedRoommate.id)}
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        favorites.includes(selectedRoommate.id)
                          ? 'bg-red-50 border-red-200 text-red-600'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={20} fill={favorites.includes(selectedRoommate.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && selectedRoommate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">İletişime Geç</h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">İletişim kurulacak kişi:</p>
                <p className="font-semibold text-gray-900">{selectedRoommate.name}</p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    placeholder="Merhaba! Ev arkadaşı ilanınızla ilgileniyorum..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-black py-2 px-4 rounded-lg font-medium transition-all duration-300"
                  >
                    Mesaj Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowContactModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Type Selection Modal */}
      {showTypeSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">İlan Türü Seçin</h2>
                <button
                  onClick={() => setShowTypeSelection(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setAddForm({...addForm, type: 'seeking'});
                    setShowTypeSelection(false);
                    setShowAddModal(true);
                  }}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <UserPlus size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Ev Arkadaşı Arıyorum</h3>
                      <p className="text-gray-600 text-sm">Ev arkadaşı arayan kişiler için ilan verin</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setAddForm({...addForm, type: 'offering'});
                    setShowTypeSelection(false);
                    setShowAddModal(true);
                  }}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                      <Home size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Ev Arıyorum</h3>
                      <p className="text-gray-600 text-sm">Ev arayan kişiler için ilan verin</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {addForm.type === 'seeking' ? 'Ev Arkadaşı Arıyorum' : 'Ev Arıyorum'} - İlan Ver
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız *</label>
                    <input
                      type="text"
                      required
                      value={addForm.name}
                      onChange={(e) => setAddForm({...addForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yaşınız *</label>
                    <input
                      type="number"
                      required
                      min="16"
                      max="100"
                      value={addForm.age}
                      onChange={(e) => setAddForm({...addForm, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Üniversite *</label>
                    <input
                      type="text"
                      required
                      value={addForm.university}
                      onChange={(e) => setAddForm({...addForm, university: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bölüm *</label>
                    <input
                      type="text"
                      required
                      value={addForm.department}
                      onChange={(e) => setAddForm({...addForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir *</label>
                    <select
                      required
                      value={addForm.location}
                      onChange={(e) => setAddForm({...addForm, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="">Şehir seçin</option>
                      <option value="Lefkoşa">Lefkoşa</option>
                      <option value="Girne">Girne</option>
                      <option value="Gazimağusa">Gazimağusa</option>
                      <option value="Lefke">Lefke</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cinsiyet *</label>
                    <select
                      required
                      value={addForm.gender}
                      onChange={(e) => setAddForm({...addForm, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    >
                      <option value="">Cinsiyet seçin</option>
                      <option value="Erkek">Erkek</option>
                      <option value="Kadın">Kadın</option>
                    </select>
                  </div>

                  {addForm.type === 'seeking' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aylık Kira (TL) *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={addForm.price}
                          onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Oda Tipi *</label>
                        <select
                          required
                          value={addForm.roomType}
                          onChange={(e) => setAddForm({...addForm, roomType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        >
                          <option value="">Oda tipi seçin</option>
                          <option value="Tek kişilik oda">Tek kişilik oda</option>
                          <option value="Paylaşımlı oda">Paylaşımlı oda</option>
                          <option value="Stüdyo daire">Stüdyo daire</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Müsait Olduğu Tarih *</label>
                        <input
                          type="date"
                          required
                          value={addForm.availableFrom}
                          onChange={(e) => setAddForm({...addForm, availableFrom: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      </div>
                    </>
                  )}

                  {addForm.type === 'offering' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bütçe Aralığı (TL)</label>
                      <select
                        value={addForm.price}
                        onChange={(e) => setAddForm({...addForm, price: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option value="">Bütçe aralığı seçin</option>
                        <option value="0-500">0-500 TL</option>
                        <option value="500-1000">500-1000 TL</option>
                        <option value="1000-2000">1000-2000 TL</option>
                        <option value="2000-9999">2000+ TL</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama *</label>
                  <textarea
                    required
                    rows={4}
                    value={addForm.description}
                    onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                    placeholder={addForm.type === 'seeking' ? "Kendinizi tanıtın ve aradığınız ev arkadaşı özelliklerini belirtin..." : "Aradığınız ev özelliklerini ve tercihlerinizi belirtin..."}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addForm.smoking}
                      onChange={(e) => setAddForm({...addForm, smoking: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Sigara kullanıyorum</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addForm.pets}
                      onChange={(e) => setAddForm({...addForm, pets: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Evcil hayvanım var</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-black py-3 px-4 rounded-lg font-medium transition-all duration-300"
                  >
                    İlanı Yayınla
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}