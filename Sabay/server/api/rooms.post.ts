import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.hotelId || !body?.name || !body?.price) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hotel ID, Room Name, and Price are required.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const hotel = db.hotels.find((h: { id: number }) => h.id === Number(body.hotelId))

  if (!hotel) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Parent hotel property not found.'
    })
  }

  const newRoom = {
    id: Date.now(),
    name: body.name,
    type: body.type || 'Standard',
    capacity: Number(body.capacity) || 2,
    beds: body.beds || '1 Queen Bed',
    price: Number(body.price),
    status: body.status || 'Available'
  }

  if (!hotel.rooms) {
    hotel.rooms = []
  }

  hotel.rooms.push(newRoom)

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    room: newRoom
  }
})