import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const hotelId = Number(query.hotelId)
  const roomId = Number(query.roomId)

  if (!hotelId || !roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Both hotelId and roomId parameters are required.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const hotel = db.hotels.find((h: { id: number }) => h.id === hotelId)
  if (!hotel) {
    throw createError({ statusCode: 404, statusMessage: 'Hotel not found.' })
  }

  hotel.rooms = hotel.rooms.filter((r: { id: number }) => r.id !== roomId)

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    message: `Room ${roomId} deleted successfully.`
  }
})