import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.name || !body?.city || !body?.pricePerNight) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required property fields (Name, City, or Price).'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const newHotel = {
    id: Date.now(),
    name: body.name,
    city: body.city,
    address: body.address || '',
    description: body.description || '',
    pricePerNight: Number(body.pricePerNight),
    rating: 5.0,
    reviewsCount: 0,
    image: body.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
    rooms: body.rooms || []
  }

  if (!db.hotels) {
    db.hotels = []
  }

  db.hotels.unshift(newHotel)

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    hotel: newHotel
  }
})