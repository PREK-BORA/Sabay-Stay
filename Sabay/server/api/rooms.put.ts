import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.hotelId || !body?.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hotel ID and Room ID are required for room updates.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const hotel = db.hotels.find((h: { id: number }) => h.id === Number(body.hotelId))
  if (!hotel) {
    throw createError({ statusCode: 404, statusMessage: 'Hotel not found.' })
  }

  const roomIndex = hotel.rooms.findIndex((r: { id: number }) => r.id === Number(body.id))
  if (roomIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Room not found.' })
  }

  hotel.rooms[roomIndex] = {
    ...hotel.rooms[roomIndex],
    ...body,
    price: body.price ? Number(body.price) : hotel.rooms[roomIndex].price,
    capacity: body.capacity ? Number(body.capacity) : hotel.rooms[roomIndex].capacity
  }

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    room: hotel.rooms[roomIndex]
  }
})