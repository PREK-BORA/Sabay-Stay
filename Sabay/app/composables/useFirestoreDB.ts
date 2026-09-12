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

  const ensureDb = () => {
    if (!$db) throw new Error("Firestore instance ($db) is not initialized yet.")
  }

  // 1. HOTELS COLLECTION
  const getHotels = async () => {
    ensureDb()
    const querySnapshot = await getDocs(collection($db, 'hotels'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addHotel = async (hotelData: any) => {
    ensureDb()
    const docRef = await addDoc(collection($db, 'hotels'), {
      ...hotelData,
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const updateHotel = async (hotelId: string, hotelData: any) => {
    ensureDb()
    // Guard against trying to update temporary local IDs
    if (!hotelId || hotelId.startsWith('temp-')) return
    const hotelRef = doc($db, 'hotels', hotelId)
    await updateDoc(hotelRef, hotelData)
  }

  const deleteHotel = async (hotelId: string) => {
    ensureDb()
    // Guard against trying to delete temporary local IDs
    if (!hotelId || hotelId.startsWith('temp-')) return
    const docRef = doc($db, 'hotels', hotelId)
    await deleteDoc(docRef)
  }

  // 2. ROOM COLLECTION
  const getRoomsByHotel = async (hotelId: string) => {
    ensureDb()
    const q = query(collection($db, 'room'), where('hotelId', '==', hotelId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addRoom = async (hotelId: string, roomData: any) => {
    ensureDb()
    const docRef = await addDoc(collection($db, 'room'), {
      hotelId: hotelId || 'default',
      ...roomData,
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const updateRoom = async (roomId: string, roomData: any) => {
    ensureDb()
    if (!roomId || roomId.startsWith('temp-')) return
    const roomRef = doc($db, 'room', roomId)
    await updateDoc(roomRef, roomData)
  }

  const deleteRoom = async (roomId: string) => {
    ensureDb()
    if (!roomId || roomId.startsWith('temp-')) return
    const docRef = doc($db, 'room', roomId)
    await deleteDoc(docRef)
  }

  // 3. BOOKINGS COLLECTION
  const createBooking = async (bookingData: any) => {
    ensureDb()
    const docRef = await addDoc(collection($db, 'bookings'), {
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    })
    return docRef
  }

  const getBookingsByGuest = async (email: string) => {
    ensureDb()
    const q = query(collection($db, 'bookings'), where('guestEmail', '==', email))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  // 4. REVIEWS COLLECTION
  const getReviewsByHotel = async (hotelId: string) => {
    ensureDb()
    const q = query(collection($db, 'reviews'), where('hotelId', '==', hotelId))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  const addReview = async (hotelId: string, reviewData: any) => {
    ensureDb()
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