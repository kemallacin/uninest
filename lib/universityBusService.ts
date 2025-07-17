interface UniversityBusSchedule {
  time: string;
  type: 'normal' | 'express' | 'university';
  destination?: string;
  university?: string;
  route?: string;
}

interface UniversityBusRoute {
  id: string;
  name: string;
  weekday: UniversityBusSchedule[];
  weekend: UniversityBusSchedule[];
}

interface UniversityBusData {
  university: string;
  universityId: string;
  website: string;
  routes: UniversityBusRoute[];
  lastUpdated: string;
}

export class UniversityBusService {
  private static instance: UniversityBusService;
  private cache: Map<string, UniversityBusData> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): UniversityBusService {
    if (!UniversityBusService.instance) {
      UniversityBusService.instance = new UniversityBusService();
    }
    return UniversityBusService.instance;
  }

  // Fetch bus data from NEU website
  private async fetchNEUBusData(): Promise<UniversityBusData> {
    try {
      // In a real implementation, this would make an actual API call to NEU's bus system
      // For now, we'll return mock data that simulates real NEU bus schedules
      
      const mockNEUData: UniversityBusData = {
        university: 'Yakın Doğu Üniversitesi',
        universityId: 'neu',
        website: 'https://bus.neu.edu.tr/',
        lastUpdated: new Date().toISOString(),
        routes: [
          {
            id: 'kampus-merkez',
            name: 'Kampüs → Merkez',
            weekday: [
              { time: '07:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '07:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '08:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '08:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '09:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '09:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '10:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '11:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '12:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '13:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '14:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '15:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '16:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '17:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '18:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '19:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '19:30', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '20:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' }
            ],
            weekend: [
              { time: '09:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'NEU' }
            ]
          },
          {
            id: 'merkez-kampus',
            name: 'Merkez → Kampüs',
            weekday: [
              { time: '07:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '07:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '08:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '08:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '09:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '09:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '10:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '10:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '11:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '11:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '12:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '12:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '13:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '13:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '14:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '14:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '15:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '15:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '16:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '16:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '17:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '17:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '18:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '18:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '19:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '19:45', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' }
            ],
            weekend: [
              { time: '09:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '10:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '11:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '12:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '13:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '14:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '15:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '16:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '17:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' },
              { time: '18:15', type: 'university', destination: 'Merkez → Kampüs', university: 'NEU' }
            ]
          }
        ]
      };

      return mockNEUData;
    } catch (error) {
      console.error('NEU bus data fetch error:', error);
      throw new Error('NEU otobüs verileri alınamadı');
    }
  }

  // Fetch bus data from EUL website
  private async fetchEULBusData(): Promise<UniversityBusData> {
    try {
      const mockEULData: UniversityBusData = {
        university: 'Avrupa Üniversitesi',
        universityId: 'eul',
        website: 'https://eul.edu.tr/',
        lastUpdated: new Date().toISOString(),
        routes: [
          {
            id: 'kampus-merkez',
            name: 'Kampüs → Merkez',
            weekday: [
              { time: '07:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '08:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '08:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '09:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '09:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '10:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '11:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '12:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '13:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '14:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '15:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '16:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '17:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '18:30', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '19:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' }
            ],
            weekend: [
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'EUL' }
            ]
          },
          {
            id: 'merkez-kampus',
            name: 'Merkez → Kampüs',
            weekday: [
              { time: '07:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '08:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '08:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '09:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '09:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '10:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '10:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '11:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '11:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '12:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '12:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '13:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '13:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '14:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '14:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '15:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '15:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '16:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '16:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '17:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '17:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '18:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '18:45', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '19:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' }
            ],
            weekend: [
              { time: '10:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '11:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '12:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '13:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '14:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '15:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '16:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '17:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' },
              { time: '18:15', type: 'university', destination: 'Merkez → Kampüs', university: 'EUL' }
            ]
          }
        ]
      };

      return mockEULData;
    } catch (error) {
      console.error('EUL bus data fetch error:', error);
      throw new Error('EUL otobüs verileri alınamadı');
    }
  }

  // Fetch bus data from CIU website
  private async fetchCIUBusData(): Promise<UniversityBusData> {
    try {
      const mockCIUData: UniversityBusData = {
        university: 'Kıbrıs Uluslararası Üniversitesi',
        universityId: 'ciu',
        website: 'https://ciu.edu.tr/',
        lastUpdated: new Date().toISOString(),
        routes: [
          {
            id: 'kampus-merkez',
            name: 'Kampüs → Merkez',
            weekday: [
              { time: '08:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '09:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '19:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' }
            ],
            weekend: [
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'CIU' }
            ]
          }
        ]
      };

      return mockCIUData;
    } catch (error) {
      console.error('CIU bus data fetch error:', error);
      throw new Error('CIU otobüs verileri alınamadı');
    }
  }

  // Fetch bus data from UIU website
  private async fetchUIUBusData(): Promise<UniversityBusData> {
    try {
      const mockUIUData: UniversityBusData = {
        university: 'Uluslararası İslam Üniversitesi',
        universityId: 'uiu',
        website: 'https://uiu.edu.tr/',
        lastUpdated: new Date().toISOString(),
        routes: [
          {
            id: 'kampus-merkez',
            name: 'Kampüs → Merkez',
            weekday: [
              { time: '08:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '09:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '11:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '13:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '15:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '17:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' }
            ],
            weekend: [
              { time: '10:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '12:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '14:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '16:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' },
              { time: '18:00', type: 'university', destination: 'Kampüs → Merkez', university: 'UIU' }
            ]
          }
        ]
      };

      return mockUIUData;
    } catch (error) {
      console.error('UIU bus data fetch error:', error);
      throw new Error('UIU otobüs verileri alınamadı');
    }
  }

  // Main method to fetch university bus data
  async fetchUniversityBusData(universityId: string): Promise<UniversityBusData[]> {
    try {
      // Check cache first
      const cacheKey = universityId;
      const cachedData = this.cache.get(cacheKey);
      const cacheTime = this.cacheExpiry.get(cacheKey);

      if (cachedData && cacheTime && Date.now() < cacheTime) {
        return universityId === 'all' ? Array.from(this.cache.values()) : [cachedData];
      }

      // Fetch fresh data
      let results: UniversityBusData[] = [];

      if (universityId === 'all') {
        // Fetch data from all universities
        const promises = [
          this.fetchNEUBusData(),
          this.fetchEULBusData(),
          this.fetchCIUBusData(),
          this.fetchUIUBusData()
        ];

        const allData = await Promise.allSettled(promises);
        results = allData
          .filter((result): result is PromiseFulfilledResult<UniversityBusData> => result.status === 'fulfilled')
          .map(result => result.value);

        // Cache all results
        results.forEach(data => {
          this.cache.set(data.universityId, data);
          this.cacheExpiry.set(data.universityId, Date.now() + this.CACHE_DURATION);
        });
      } else {
        // Fetch data from specific university
        let data: UniversityBusData;
        
        switch (universityId) {
          case 'neu':
            data = await this.fetchNEUBusData();
            break;
          case 'eul':
            data = await this.fetchEULBusData();
            break;
          case 'ciu':
            data = await this.fetchCIUBusData();
            break;
          case 'uiu':
            data = await this.fetchUIUBusData();
            break;
          default:
            throw new Error(`Bilinmeyen üniversite: ${universityId}`);
        }

        results = [data];
        
        // Cache the result
        this.cache.set(data.universityId, data);
        this.cacheExpiry.set(data.universityId, Date.now() + this.CACHE_DURATION);
      }

      return results;
    } catch (error) {
      console.error('University bus data fetch error:', error);
      throw error;
    }
  }

  // Method to clear cache
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  // Method to get cache status
  getCacheStatus(): { [key: string]: { cached: boolean; expiresAt?: Date } } {
    const status: { [key: string]: { cached: boolean; expiresAt?: Date } } = {};
    
    for (const [key, expiry] of this.cacheExpiry.entries()) {
      status[key] = {
        cached: Date.now() < expiry,
        expiresAt: new Date(expiry)
      };
    }
    
    return status;
  }
}

export default UniversityBusService; 