import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.guestName || !body?.guestEmail || !body?.hotelId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required booking fields.'
    })
  }

  const filePath = path.resolve(process.cwd(), 'server/data/db.json')
  const rawData = fs.readFileSync(filePath, 'utf-8')
  const db = JSON.parse(rawData)

  const newBooking = {
    id: 'BK-' + Math.floor(100000 + Math.random() * 900000),
    ...body,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  }

  if (!db.bookings) {
    db.bookings = []
  }

  db.bookings.push(newBooking)

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf-8')

  return {
    success: true,
    bookingId: newBooking.id,
    status: newBooking.status
  }
})