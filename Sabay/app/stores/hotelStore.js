import { defineStore } from 'pinia'

export const useHotelStore = defineStore('hotel', {
  state: () => ({
    hotels: [],
    bookings: [],
    loading: false,
    error: null
  }),

  getters: {
    getHotelById: (state) => (id) => state.hotels.find(h => h.id === Number(id)),
    allBookings: (state) => state.bookings
  },

  actions: {
    // Fetch hotels from server/data/db.json via API
    async fetchHotels() {
      this.loading = true
      try {
        const data = await $fetch('/api/hotels')
        this.hotels = data || []
      } catch (err) {
        this.error = 'Failed to load hotels'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    // Submit new booking to server API and append to db.json
    async createBooking(bookingPayload) {
      try {
        const response = await $fetch('/api/bookings', {
          method: 'POST',
          body: bookingPayload
        })

        if (response.success) {
          this.bookings.push({
            id: response.bookingId,
            ...bookingPayload,
            status: response.status
          })
        }
        return response
      } catch (err) {
        console.error('Failed to create booking:', err)
        throw err
      }
    },
    // Owner API Actions
    async addHotel(hotelData) {
      const response = await $fetch('/api/hotels', {
        method: 'POST',
        body: hotelData
      })
      if (response.success) {
        this.hotels.unshift(response.hotel)
      }
      return response
    },

    async updateHotel(hotelData) {
      const response = await $fetch('/api/hotels', {
        method: 'PUT',
        body: hotelData
      })
      if (response.success) {
        const idx = this.hotels.findIndex(h => h.id === hotelData.id)
        if (idx !== -1) this.hotels[idx] = response.hotel
      }
      return response
    },

    async deleteHotel(hotelId) {
      const response = await $fetch(`/api/hotels?id=${hotelId}`, {
        method: 'DELETE'
      })
      if (response.success) {
        this.hotels = this.hotels.filter(h => h.id !== hotelId)
      }
      return response
    },
    // Room API Actions
    async addRoom(hotelId, roomData) {
      const response = await $fetch('/api/rooms', {
        method: 'POST',
        body: { hotelId, ...roomData }
      })
      if (response.success) {
        const hotel = this.getHotelById(hotelId)
        if (hotel) hotel.rooms.push(response.room)
      }
      return response
    },

    async updateRoom(hotelId, roomData) {
      const response = await $fetch('/api/rooms', {
        method: 'PUT',
        body: { hotelId, ...roomData }
      })
      if (response.success) {
        const hotel = this.getHotelById(hotelId)
        if (hotel) {
          const idx = hotel.rooms.findIndex(r => r.id === roomData.id)
          if (idx !== -1) hotel.rooms[idx] = response.room
        }
      }
      return response
    },

    async deleteRoom(hotelId, roomId) {
      const response = await $fetch(`/api/rooms?hotelId=${hotelId}&roomId=${roomId}`, {
        method: 'DELETE'
      })
      if (response.success) {
        const hotel = this.getHotelById(hotelId)
        if (hotel) {
          hotel.rooms = hotel.rooms.filter(r => r.id !== roomId)
        }
      }
      return response
    }
  }
})