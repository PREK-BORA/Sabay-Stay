import { computed, ref, useState } from '#imports'

export interface Hotel {
  id: number
  name: string
  location: string
  region: string
  price: number
  rating: number
  reviewsCount: number
  image: string
  description: string
  amenities: string[]
  isFeatured?: boolean
}

export const useHotels = () => {
  // Global State សម្រាប់ Hotels Data
  const hotels = useState<Hotel[]>('hotels_list', () => [
    {
      id: 1,
      name: 'The Azure Retreat',
      location: 'Maldives',
      region: 'Maldives',
      price: 600,
      rating: 4.9,
      reviewsCount: 128,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      description: 'Experience pure luxury in overwater bungalows with private ocean pools.',
      amenities: ['Free WiFi', 'Private Pool', 'Spa', 'Beachfront'],
      isFeatured: true
    },
    {
      id: 2,
      name: 'Metro Grand Suites',
      location: 'Tokyo, Japan',
      region: 'Tokyo',
      price: 360,
      rating: 4.8,
      reviewsCount: 94,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      description: 'A modern luxury stay right in the heart of Tokyo with panoramic sky views.',
      amenities: ['Free WiFi', 'Fitness Center', 'Bar', 'City View'],
      isFeatured: true
    },
    {
      id: 3,
      name: 'Bali Cliffside Villa',
      location: 'Uluwatu, Bali',
      region: 'Bali',
      price: 450,
      rating: 4.7,
      reviewsCount: 210,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      description: 'Stunning cliffside ocean view villas with private infinity pools.',
      amenities: ['Infinity Pool', 'Free Breakfast', 'Ocean View', 'Spa'],
      isFeatured: false
    }
  ])

  // Search, Filter, and Selected Hotel State
  const searchQuery = useState<string>('hotel_search_query', () => '')
  const selectedRegion = useState<string>('hotel_selected_region', () => 'All')
  const loading = ref<boolean>(false)

  // Computed: ស្វែងរក និង Filter សណ្ឋាគារដោយស្វ័យប្រវត្តិ
  const filteredHotels = computed(() => {
    return hotels.value.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            hotel.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchesRegion = selectedRegion.value === 'All' || hotel.region === selectedRegion.value

      return matchesSearch && matchesRegion
    })
  })

  // Get Hotel by ID
  const getHotelById = (id: number) => {
    return hotels.value.find(h => h.id === Number(id))
  }

  // Add New Hotel (សម្រាប់ Admin)
  const addHotel = (newHotel: Omit<Hotel, 'id'>) => {
    const id = hotels.value.length ? Math.max(...hotels.value.map(h => h.id)) + 1 : 1
    hotels.value.push({ id, ...newHotel })
  }

  // Delete Hotel (សម្រាប់ Admin)
  const deleteHotel = (id: number) => {
    hotels.value = hotels.value.filter(h => h.id !== id)
  }

  return {
    hotels,
    loading,
    filteredHotels,
    searchQuery,
    selectedRegion,
    getHotelById,
    addHotel,
    deleteHotel
  }
}
