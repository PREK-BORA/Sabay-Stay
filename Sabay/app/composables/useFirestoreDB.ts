import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore'

export const useFirestoreDB = () => {
  const { $db } = useNuxtApp()

  // 1. HOTELS COLLECTION
  const getHotels = async () => {
    const querySnapshot = await getDocs(collection($db, 'hotels'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addHotel = async (hotelData: any) => {
    const docRef = await addDoc(collection($db, 'hotels'), {
      ...hotelData,
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const updateHotel = async (hotelId: string, hotelData: any) => {
    const hotelRef = doc($db, 'hotels', hotelId)
    await updateDoc(hotelRef, hotelData)
  }

  const deleteHotel = async (hotelId: string) => {
    await deleteDoc(doc($db, 'hotels', hotelId))
  }

  // 2. ROOM COLLECTION (Collection: 'room')
  const getRoomsByHotel = async (hotelId: string) => {
    const q = query(collection($db, 'room'), where('hotelId', '==', hotelId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addRoom = async (hotelId: string, roomData: any) => {
    const docRef = await addDoc(collection($db, 'room'), {
      hotelId: hotelId || 'default',
      ...roomData,
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const updateRoom = async (roomId: string, roomData: any) => {
    const roomRef = doc($db, 'room', roomId)
    await updateDoc(roomRef, roomData)
  }

  const deleteRoom = async (roomId: string) => {
    await deleteDoc(doc($db, 'room', roomId))
  }

  // 3. BOOKINGS COLLECTION
  const createBooking = async (bookingData: any) => {
    const docRef = await addDoc(collection($db, 'bookings'), {
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const getBookingsByGuest = async (email: string) => {
    const q = query(collection($db, 'bookings'), where('guestEmail', '==', email))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // 4. REVIEWS COLLECTION
  const getReviewsByHotel = async (hotelId: string) => {
    const q = query(collection($db, 'reviews'), where('hotelId', '==', hotelId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addReview = async (hotelId: string, reviewData: any) => {
    const docRef = await addDoc(collection($db, 'reviews'), {
      hotelId,
      ...reviewData,
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  return {
    getHotels,
    addHotel,
    updateHotel,
    deleteHotel,
    getRoomsByHotel,
    addRoom,
    updateRoom,
    deleteRoom,
    createBooking,
    getBookingsByGuest,
    getReviewsByHotel,
    addReview
  }
}